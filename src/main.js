import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import {} from './project';

let nytKey = process.env.API_KEY;


function attachListeners(){
  $(".cityList").on("click", "div", function(){
    let listID = `city${this.id}-p`
    console.log(listID)
    $(`#${listID}`).slideToggle();
  });
}


$(document).ready(function(event){
  attachListeners();

  let searchArray = ["Portland","New York", "Atlanta", "Denver", "Seattle"];

  function dateCreator(){
    let d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var today = d.getFullYear() + (month<10 ? '0' : '') + month + (day<10 ? '0' : '') + day;
    return today;
  }

  function getArticles(searchWord, htmlID){
    let promise = new Promise (function(resolve, reject) {
      let request =  new XMLHttpRequest();
      let today = dateCreator();
      let url = `https:\//api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchWord}&page=1&begin_date=${today}&end_date=${today}&api-key=${nytKey}`;
      request.onload = function(){
        if(this.status === 200){
          resolve(request.response);
        }else{
          reject(Error(request.statusText));
        }
      }
      request.open("GET",url,true);
      request.send();
    });

    promise.then(function(response){
      let body = JSON.parse(response);
      let arrayLength = body.response.docs.length;
      let articles = body.response.docs

      let cityColumn = `<div class='city-block col' id='${htmlID}'><h4 class='header' id='city${htmlID}-h'>${searchWord}: ${arrayLength}</h4><div class='list' id='city${htmlID}-p'>`;

      articles.forEach(function(article){
        let headline = article.headline.main
        let section = article.section_name
        let urlArticle = article.web_url

        cityColumn = cityColumn +`<a href='${urlArticle}'><div class='blurb'><span class='headline'>${headline}</span><br><span class ='section'>${section}</span></div></a>`;
      })
      cityColumn = cityColumn + `</div></div>`;
      $(".cityList").append(cityColumn)
      $(".list").hide();

    })
  }

  for (let i=0; i<searchArray.length; i++) {
    let searchWord = searchArray[i];
    let htmlID = i;
    getArticles(searchWord,htmlID);
  }
});

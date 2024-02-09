/*
this is called a "Javascript object".
Javascript objects are quasi-classes. They can have properies storing values, or they can have functions (methods).
*/
var Site = {
  targetSelector: '', // Selector: a targeted element's property, which identifies an element az a unit, or more elements as an array. E.g. '.inputContainer' means: class="inputContainer". '#mainContent' means: id="mainContent".
  
  // processResponse is the 3rd phase of a successful ajax process. (See the 3 phases below)
  processResponse: function(response, calledBy, onSuccessCallback) {
    if (typeof this[onSuccessCallback] === 'function') {
        this[onSuccessCallback](response);
    }
  },

  /*
  What is ajax? It's a multiple phased communication between the frontend and the backend.
  - Phase 1.: Init: sending a request to the backend server.
  - Phase 2.: Response: wrapping a response on the backend for sending back to the frontend.
  - Phase 3.: Processing response on the frontend (with Javascript).
  */
  callAjax: function(calledBy, ajaxUrl, additionalData, onSuccessCallback) {
    let baseData = {};
    let ajaxData = $.extend({}, baseData, additionalData);
    $.ajax({
      'type' : 'POST',
      'dataType': 'json',
      'url' : ajaxUrl,
      'data': ajaxData,
      'async': true,
      'success': function(response) {
        Site.processResponse(response, calledBy, onSuccessCallback);
      },
      'error': function (jqXHR, textStatus, errorThrown) {
        console.error("Error:", textStatus, errorThrown);
        // Display an error message to the user
        $('#results').html('<p>An error occurred while fetching Wikipedia data.</p>');
      }
    });
  },

  /*
  An initializer method for wikiSearch. It starts the ajax call of the backend.
  */
  wikiSearchInit: function(event, protocolAndDomain, searchTerm) {
    if (event) {
      event.preventDefault();
    }
    $('#results').html('');
    Site.callAjax('wikiSearchInit', protocolAndDomain + '/libs/php/wikipediaAPI.php', {
        'q': searchTerm
    }, 'wikiSearchCallback');
  },

  appendWikipediaResults: function(entry) {
    var resultHtml = '<div class="wikiResult">';
    resultHtml += '<h3>' + entry.title + '</h3>';
    resultHtml += '<p>' + entry.summary + '</p>'; // Display the summary (full text)
    resultHtml += '<p><a href="' + entry.wikipediaUrl + '" target="_blank">Read more</a></p>';
    resultHtml += '</div>';
    $('#results').append(resultHtml);
  },

  /*
  Callback method is called right after the backend successfully responsed to the frontend.
  */
  wikiSearchCallback: function(response) {
    $.each(response, function (i, item) {
      $.each(item, function (index, val) {
        Site.appendWikipediaResults(val);
      });
    });
    // Clear the input field
    $('#wikipediaSearchInput').val('');
  },

  /*
  An initializer method for neighbourSearch. It starts the ajax call of the backend.
  */
  neighbourSearchInit: function(event, protocolAndDomain, selectedCountry) {
    if (event) {
      event.preventDefault();
    }
    $('#results').html('');
    Site.callAjax('neighbourSearchInit', protocolAndDomain + '/libs/php/neighboursAPI.php', {
        'country': selectedCountry
    }, 'neighbourSearchCallback');
  },

  /*
  Callback method is called right after the backend successfully responsed to the frontend.
  */
  neighbourSearchCallback: function(response) {
    if (response.status.name == "ok") {
      var neighborList = "";
      response.data.forEach(function (country) {
        neighborList += "<li>" + country.countryName + "</li>";
      });
      $('#results').html('<ul>' + neighborList + '</ul>'); // Update #results with neighborList
      // Clear the input field
      $('#selCountry').val('');
    }
  },

  /*
  An initializer method for countrySearch. It starts the ajax call of the backend.
  */
  countryInfoSearchInit: function(event, protocolAndDomain, countryCode) {
    if (event) {
      event.preventDefault();
    }
    $('#results').html('');
    Site.callAjax('countryInfoSearchInit', protocolAndDomain + '/libs/php/countryInfoAPI.php', {
        'country': countryCode
    }, 'countryInfoSearchCallback');
  },

  appendCountryInfoResults: function(result) {
    console.log('appendCountryInfoResults');
    var resultHtml = '<div class="countryInfo">';
    resultHtml += '<p><strong>Continent:</strong> ' + result.continent + '</p>';
    resultHtml += '<p><strong>Capital:</strong> ' + result.capital + '</p>';
    resultHtml += '<p><strong>Languages:</strong> ' + result.languages + '</p>';
    resultHtml += '<p><strong>Population:</strong> ' + result.population + '</p>';
    // Add more properties as needed
    resultHtml += '</div>';
    $('#results').append(resultHtml);
  },

  /*
  Callback method is called right after the backend successfully responsed to the frontend.
  */
  countryInfoSearchCallback: function(response) {
    console.log('countryInfoSearchCallback');
    $.each(response, function (i, item) {
      $.each(item, function (index, val) {
        Site.appendCountryInfoResults(val);
      });
    });
    // Clear the input field
    $('#countryCodeInput').val('');
  },
};
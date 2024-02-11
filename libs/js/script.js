const Site = {
  targetSelector: '',

  processResponse: function(response, onSuccessCallback) {
    if (typeof this[onSuccessCallback] === 'function') {
      this[onSuccessCallback](response);
    }
  },

  callAjax: function(ajaxUrl, additionalData, onSuccessCallback) {
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: ajaxUrl,
      data: $.extend({}, additionalData),
      async: true,
      success: function(response) {
        Site.processResponse(response, onSuccessCallback);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error("Error:", textStatus, errorThrown);
        $('#results').html('<p>An error occurred while fetching data.</p>');
      }
    });
  },

  wikiSearchInit: function(protocolAndDomain, searchTerm) {
    $('#results').html('');
    Site.callAjax(protocolAndDomain + '/libs/php/wikipediaAPI.php', {'q': searchTerm}, 'wikiSearchCallback');
  },

  appendWikipediaResults: function(entry) {
    let resultHtml = '<div class="wikiResult">';
    resultHtml += '<h3>' + entry.title + '</h3>';
    resultHtml += '<p>' + entry.summary + '</p>';
    resultHtml += '<p><a href="' + entry.wikipediaUrl + '" target="_blank">Read more</a></p>';
    resultHtml += '</div>';
    $('#results').append(resultHtml);
  },

  wikiSearchCallback: function(response) {
    $.each(response, function(i, item) {
      $.each(item, function(index, val) {
        Site.appendWikipediaResults(val);
      });
    });
    $('#wikipediaSearchInput').val('');
  },

  neighbourSearchInit: function(protocolAndDomain, selectedCountry) {
    $('#results').html('');
    Site.callAjax(protocolAndDomain + '/libs/php/neighboursAPI.php', {'country': selectedCountry}, 'neighbourSearchCallback');
  },

  neighbourSearchCallback: function(response) {
    if (response.status.name == "ok") {
      let neighborList = "";
      response.data.forEach(function(country) {
        neighborList += "<li>" + country.countryName + "</li>";
      });
      $('#results').html('<ul>' + neighborList + '</ul>');
    }
  },

  countryInfoSearchInit: function(protocolAndDomain, countryCode) {
    $('#results').html('');
    Site.callAjax(protocolAndDomain + '/libs/php/countryInfoAPI.php', {'country': countryCode}, 'countryInfoSearchCallback');
  },

  appendCountryInfoResults: function(result) {
    let resultHtml = '<div class="countryInfo">';
    resultHtml += '<p><strong>Continent:</strong> ' + result.continent + '</p>';
    resultHtml += '<p><strong>Capital:</strong> ' + result.capital + '</p>';
    resultHtml += '<p><strong>Languages:</strong> ' + result.languages + '</p>';
    resultHtml += '<p><strong>Population:</strong> ' + result.population + '</p>';
    resultHtml += '</div>';
    $('#results').append(resultHtml);
  },

  countryInfoSearchCallback: function(response) {
    $.each(response, function(i, item) {
      $.each(item, function(index, val) {
        Site.appendCountryInfoResults(val);
      });
    });
  },

  addressInfoSearchInit: function(protocolAndDomain, address) {
    $('#results').html('');
    Site.callAjax(protocolAndDomain + '/libs/php/addressInfoAPI.php', {'address': address}, 'appendAddressInfoResults');
  },

  appendAddressInfoResults: function(result) {
    let resultHtml = '<div class="addressResult">';
    resultHtml += '<h3>Latitude for Location : </h3>' + result.lat;
    resultHtml += '<h3> Longitude for Location : </h3>' + result.lng;
    resultHtml += '</div>';
    $('#results').append(resultHtml);
  },

  countryInfoListInit: function(protocolAndDomain, searchTerm) {
    $('#results').html('');
    Site.callAjax(protocolAndDomain + '/libs/php/countryListAPI.php', {'q': searchTerm}, 'countryInfoListCallback');
  },

  appendCountryInfoListResults: function(entry) {
    $('#selCountry').append('<option value="' + entry.countryCode + '">' + entry.countryName + '</option>');
    $('#countryCodeInput').append('<option value="' + entry.countryCode + '">' + entry.countryName + '</option>');
  },

  countryInfoListCallback: function(response) {
    $.each(response, function(i, item) {
      Site.appendCountryInfoListResults(item);
    });
  },
};

$(document).ready(function() {
  $('#preloader').length && $('#preloader').delay(1000).fadeOut('slow', function() {
    $(this).remove();
  });

  $('#wikiBtn').click(function() {
    let searchTerm = $('#wikipediaSearchInput').val().trim();
    searchTerm !== '' ? Site.wikiSearchInit('', searchTerm) : alert('Please enter a search term.');
  });

  $('#neighbourBtn').click(function() {
    let selectedCountry = $('#selCountry').val();
    selectedCountry ? Site.neighbourSearchInit('', selectedCountry) : alert('Please select a country.');
  });

  $('#countryBtn').click(function() {
    let countryCode = $('#countryCodeInput').val().trim();
    countryCode !== '' ? Site.countryInfoSearchInit('', countryCode) : alert('Please enter a country code.');
  });

  $('#addressBtn').click(function() {
    let address = $('#addressInput').val().trim();
    address !== '' ? Site.addressInfoSearchInit('', address) : alert('Please enter an address.');
  });

  Site.countryInfoListInit('', '');
});

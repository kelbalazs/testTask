<?php  

function getPseudoDomain()
{
  $pseudoDomain = $_SERVER['SCRIPT_NAME'];
  $pseudoDomain = str_replace('index.php?r=', '', $pseudoDomain);
  $pseudoDomain = str_replace('index.php', '', $pseudoDomain);

  return $pseudoDomain;
}

function getFullDomain()
{
  $fullDomain = $_SERVER['SERVER_NAME'] . (($_SERVER['SERVER_PORT'] != '80')
      ? (':' . $_SERVER['SERVER_PORT']).getPseudoDomain()
      : ''.getPseudoDomain());
      
  return str_replace(':443', '', trim($fullDomain, '/'));
}

function getHttpDomain()
{
  return ((isset($_SERVER['HTTPS']) and ($_SERVER['HTTPS'] == 'on')) ? 'https' : 'http') . '://' . getFullDomain();
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="author" content="kelbal" />
  <link rel="icon" type="image/png" href="favicon.ico">

  <meta name="description" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="libs/js/jquery-3.7.1.min.js"></script>
  <script src="libs/js/script.js"></script>
  <link href="libs/css/style.css" rel="stylesheet" />
  <title>Task</title>
</head>

<body>
  <h1>IT Career Switch Task</h1>
  <div id="preloader"></div>
  <div class="header-image">
    <img src="html-css-js-php-jquery.png" alt="" />
  </div>

  <div id="apiTable" class="animate-bottom">
    <table>
      <thead>
        <tr id="head">
          <th>API Name</th>
          <th>API Description</th>
          <th>Click Submit</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="apiName">Wikipedia</td>
          <td class="apiDescription">
            Returns the Wikipedia entries found for the search term.
            <input
              type="text"
              id="wikipediaSearchInput"
              placeholder="Enter Search Term"
            />
          </td>
          <td class="wrap">
            <button class="button" id="wikiBtn">Submit</button>
          </td>
        </tr>
        <tr>
          <td class="apiName">Neigbours</td>
          <td class="apiDescription">
            Returns all neighbours for a country or administrative division.
            <label for="country">Country:</label>
            <input
              id="selCountry"
              type="text"
              placeholder="Enter country code"
            />
          </td>
          <td class="wrap">
            <button class="button" id="neighbourBtn">Submit</button>
          </td>
        </tr>
        <tr>
          <td class="apiName">Country Information</td>
          <td class="apiDescription">
            Returns Country Info like continent,capital, languages, population
            <input
              type="text"
              id="countryCodeInput"
              placeholder="Enter Country Code"
            />
          </td>
          <td class="wrap">
            <button class="button" id="countryBtn">Submit</button>
          </td>
        </tr>

        <tr>
          <td colspan="4" id="results"></td>
        </tr>
      </tbody>
    </table>
  </div>
  <script>
    $('document').ready(function () {

      if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
          $(this).remove();
        });
      }
    
      // Wikipedia Search
      $('#wikiBtn').click(function () {
        var searchTerm = $('#wikipediaSearchInput').val().trim();
        if (searchTerm !== '') {
          Site.wikiSearchInit(null, '<?php echo getHttpDomain(); ?>', searchTerm);
        } else {
          alert('Please enter a search term.');
        }
      });
    
      // Neighbours Search
      $('#neighbourBtn').click(function () {
        var selectedCountry = $('#selCountry').val();
        if (selectedCountry) {
          Site.neighbourSearchInit(null, '<?php echo getHttpDomain(); ?>', selectedCountry);
        } else {
          alert('Please select a country.');
        }
      });
    
      // Country Info Search
      $('#countryBtn').click(function () {
        var countryCode = $('#countryCodeInput').val().trim();
        if (countryCode !== '') {
          Site.countryInfoSearchInit(null, '<?php echo getHttpDomain(); ?>', countryCode);
        } else {
          alert('Please enter a country code.');
        }
      });
    
    });
  </script>
</body>
</html>

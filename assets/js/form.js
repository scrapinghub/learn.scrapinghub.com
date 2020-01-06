function getQueryStrParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function storeUrlParam(param_name) {
  var hasCookie = getStoredParam(param_name);
  if (hasCookie == "" || hasCookie) return;
  var param = getQueryStrParam(param_name) || "";
  Cookies.set(param_name, param, {domain: ".scrapinghub.com", expires: 90})
}

function getStoredParam(param_name) {
  return Cookies.get(param_name, {domain: ".scrapinghub.com"})
}

jQuery(function ($) {
  var ip_info_url = 'https://api.ipstack.com/check?access_key=2929a6b9a5417671d6fa6dd87eca1327&format=1';

  function update_region_info(region_data) {
    if (!region_data.location.is_eu) {
      jQuery('.non-europe-check').prop('checked', true);
    }
  }
  $.ajax({
    dataType: "json",
    url: ip_info_url
  }).done(function (region_data) {
    update_region_info(region_data);
  });

  storeUrlParam("utm_campaign");
  storeUrlParam("utm_activity");
  storeUrlParam("utm_medium");
  storeUrlParam("utm_source");
  storeUrlParam("utm_content");
  storeUrlParam("utm_primary");
  storeUrlParam("utm_secondary");
  storeUrlParam("utm_goal");
  
  storeUrlParam("gclid");

  $('#gclid').val(getStoredParam("gclid"));
  $('#utm_campaign').val(getStoredParam('utm_campaign'));
  $('#utm_activity').val(getStoredParam('utm_activity'));
  $('#utm_medium').val(getStoredParam('utm_medium'));
  $('#utm_source').val(getStoredParam('utm_source'));
  $('#utm_content').val(getStoredParam('utm_content'));
  $('#utm_primary').val(getStoredParam('utm_primary'));
  $('#utm_secondary').val(getStoredParam('utm_secondary'));
  $('#utm_goal').val(getStoredParam('utm_goal'));

  $.get("https://ipapi.co/json/", function (x) {
    $("#country").val(x["country_name"]);
    $("#city").val(x["city"]);
  });

  function waitForGA() {
    if (typeof ga !== "undefined" && typeof ga.getAll === "function") {
      try {
        $("#ga_cid").val(ga.getAll()[0].get('clientId'));
      } catch (e) {}
    } else {
      setTimeout(waitForGA, 500);
    }
  }
  waitForGA();

  $('#submission_url').val(location.href);

  $("form.schedule-form").validate({
    rules: {
      first_name: "required",
      last_name: "required",
      email: "required",
      company: "required",
      timezone: "required",
      number_of_seats: "required",
      python_expertise: "required",
      scrapy_expertise: "required",
      webscraping_expertise: "required",
      htmlcss_expertise: "required",
      privacy_policy: "required",
    },
    submitHandler: function (form) {
      // Used for tracking of submissions on google analytics, see thank you page
      var userId = sha256($('#email').val());
      $('#tag_manager_user_id').val(userId);
      dataLayer.push({
        'event': 'requestTraining',
        'userId': userId
      });
      form.submit();
    }
  });
});
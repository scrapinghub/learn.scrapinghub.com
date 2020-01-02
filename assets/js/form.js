function getQueryStrParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function maybeStoreUtmSource() {
  var utm_source = getQueryStrParam('utm_source');
  if (utm_source) {
    Cookies.set('utm_source', utm_source);
  }
}

function maybeStoreGclid() {
  var gclid = getQueryStrParam("gclid", window.location.search);
  if (gclid) {
    Cookies.set("gclid", gclid);
  }
}

function save_tm_user_id(user_id) {
  Cookies.set("tag_manager_user_id", sha256(user_id), {
    expires: 1,
    domain: '.scrapinghub.com'
  });
}

function get_tm_user_id() {
  return Cookies.get("tag_manager_user_id");
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

  maybeStoreUtmSource();
  maybeStoreGclid();

  $('#gclid').val(Cookies.get('gclid'));
  $('#utm_source').val(Cookies.get('utm_source'));

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
      save_tm_user_id($('#email').val());
      form.submit();
    }
  });
});
$( document ).ready(function() {

    $.get("https://freegeoip.net/json/", function(x) {
        $('#country').val(x["country_name"]);
        $('#city').val(x["city"]);
    });
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
        "privacy-policy": "required",
      },
      submitHandler: function(form) {
        Cookies.set("tag_manager_user_id", sha256($('#email').val()), { expires: 1 });
        form.submit();
      }
    });
    function setGacid(){
      if (typeof ga !== "undefined" && typeof ga.getAll === "function") {
          try {
            $("#ga_cid").val(ga.getAll()[0].get('clientId'));
          } catch (e) {}
      }
      else {
          setTimeout(setGacid, 500);
      }
    }
    setGacid();
});

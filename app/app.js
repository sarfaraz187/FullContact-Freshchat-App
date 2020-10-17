$(document).ready(function () {
  app.initialized().then(function (_client) {
    window.client = _client;
    client.events.on('app.activated', function () {
      console.log("Event has triggered !!!");
      $("#submit").on("fwClick", getPerson);
    });
  });
});

function getPerson() {
  let fullName = $("#full_name").val(), email = $("#email").val(), phone_number = $("#phone_number").val();
  fetchContactDetails(fullName, email, phone_number).then(function (payload) {
    displayModal(payload);
  }).catch(function (error) {
    console.log(error);
  });
}

function fetchContactDetails(fullName, email, phone_number) {
  let opt = {
    headers: {
      "Authorization": "Bearer <%= iparam.apiKey %>",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "full_name": fullName,
      "email": email,
      "phone": phone_number,
    })
  }
  let url = "https://api.fullcontact.com/v3/person.enrich"
  return new Promise(function (resolve) {
    client.request.post(url, opt).then(function (data) {
      resolve(JSON.parse(data.response));
    }, function (err) {
      let error = JSON.parse(err.response);
      displayNotification("danger", error.message);
    });
  });
}

function displayModal(payload) {
  client.interface.trigger("showModal", {
    title: "Sample Modal",
    template: "modal.html",
    data: payload
  }).then(function (data) {
    console.log(data)
  }).catch(function (error) {
    console.log(error)
  });
}

function displayNotification(type, message) {
  client.interface.trigger('showNotify', { type: type, message: message });
}

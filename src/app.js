import $ from 'jquery';
import swal from 'sweetalert';

let imageSource = 'https://s3.ca-central-1.amazonaws.com/p2ircimagebucket';
let start_image_index = 0;
let max_image_index = 2;
let verificationResult = [];

$("#start-button").click(() => {
    $(".start-button-panel").addClass("hidden");
    $(".verification-panel").removeClass("hidden");
})

$(".nav-button").click((event) => {

    let button_id = event.target.id || '';

    if (button_id == 'previous' && start_image_index >= 1) {

        start_image_index -= 1;

        // fetch result already stored and set the radio button value
        // and reset other radio buttons
        $('input[name="rating"]').prop('checked', false);
        $('#' + verificationResult[start_image_index].split(",")[1] + '-option').prop('checked', true);
        //switch images and disable the prev button if its the first image
        switchSource(start_image_index);
        if (start_image_index == 0) {
            $('#previous').addClass('disabled');
        }
    } else if (button_id == 'next') {

        // If none of the radio buttons are checked then the rating would be false so we wouldnt let the user proceed
        let rating = $('input[name=rating]:checked').val() || false;

        if (rating) {

            // store results in the result array
            verificationResult[start_image_index] = start_image_index + "," + rating;

            // handle image switch and panel switch
            start_image_index += 1;
            if (start_image_index > max_image_index) {
                $(".verification-panel").addClass("hidden");
                $(".complete-panel").removeClass('hidden');
            } else {
                switchSource(start_image_index);
                let next_rating_available = verificationResult[start_image_index] || false;
                if (next_rating_available) {
                    $('#' + verificationResult[start_image_index].split(",")[1] + '-option').prop('checked', true);
                } else {
                    // reset options
                    $('input[name="rating"]').prop('checked', false);
                }

            }
            $('#previous').removeClass('disabled');
        } else {
            swal("Error", "Please select one of the options provided under the images before proceeding to the next page.", "error");
        }

    }
    // the only other case is when the id is previus and the image count is zero , in this case the 
    //  although the event is fired from the button there is no previous so we let the event pass 
    else {
        event.stopPropagation();
    }

})

function switchSource(sourceCount) {
    $(".text-count").text(" - " + (sourceCount + 1))
    $('.old-image').attr('src', imageSource + "/old/" + sourceCount + ".jpg");
    $('.new-image').attr('src', imageSource + "/new/" + sourceCount + ".jpg")
}

$("#back-button").click(() => {
    start_image_index -= 1;
    $(".verification-panel").removeClass("hidden");
    $(".complete-panel").addClass('hidden');
})

$("#download-button").click(() => {
    saveData("p2irc_image_report", verificationResult)
})


function saveData(name, dataArray) {
    var csvContent = "data:text/csv;charset=utf-8," + dataArray.join("\n"),
        encodedUri = encodeURI(csvContent),
        link = document.createElement("a"),
        timeStamp = (new Date()).toString().split("GMT")[0];
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", name + "-" + timeStamp + ".csv");
    link.click();

}
import $ from 'jquery';
import swal from 'sweetalert';

// sample link for image from s3 bucket
// https://s3.ca-central-1.amazonaws.com/p2ircimagebucket/new/3.jpg



$("#start-button").click(() => {
    $(".start-button-panel").addClass("hidden");
    $(".verification-panel").removeClass("hidden");
})
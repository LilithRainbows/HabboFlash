$(document).ready(function() {
    if (typeof(localStorage.getItem('LastFlag')) == "undefined" || localStorage.getItem('LastFlag') == null) {
        $('#myCarousel').carousel(2);
    } else {
        LoadLastSavedFlag();
    }
});

function NavigateAndSaveFlag(URL) {
    var flag_index = $('div.item.flag.active').index();
    localStorage.setItem('LastFlag', flag_index);
    document.location = URL;
}

function LoadLastSavedFlag() {
    $('#myCarousel').carousel(parseInt(localStorage.getItem('LastFlag')));
}

$(document).bind('keydown', function(e) {
    if (e.which == 39) {
        $('.carousel').carousel('next');
    } else if (e.which == 37) {
        $('.carousel').carousel('prev');
    }
});
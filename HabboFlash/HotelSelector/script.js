$(document).ready(function() {
    if (typeof(localStorage.getItem('LastFlag')) == "undefined" || localStorage.getItem('LastFlag') == null) {
        var LanguageIndex = 0;
        if (navigator.language.startsWith("es")) {
            LanguageIndex = 1
        }
        if (navigator.language.startsWith("pt")) {
            LanguageIndex = 2
        }
        if (navigator.language.startsWith("it")) {
            LanguageIndex = 3
        }
        if (navigator.language.startsWith("fr")) {
            LanguageIndex = 4
        }
        if (navigator.language.startsWith("nl")) {
            LanguageIndex = 5
        }
        if (navigator.language == "fi") {
            LanguageIndex = 6
        }
        if (navigator.language.startsWith("de")) {
            LanguageIndex = 7
        }
        if (navigator.language.startsWith("tr")) {
            LanguageIndex = 8
        }
        $('#myCarousel').carousel(LanguageIndex);
    } else {
        LoadLastSavedFlag();
    }
});

function NavigateAndSaveFlag(URL) {
    var flag_index = $('div.carousel-item.active').index();
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
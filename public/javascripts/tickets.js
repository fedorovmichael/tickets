
$(document).on({
    ajaxStart: function(){ $("#divLoading").addClass("wait-modal"); $("#divLoading").removeClass("wait-modal-none");  },
    ajaxComplete: function(){ $("#divLoading").removeClass("wait-modal"); $("#divLoading").addClass("wait-modal-none"); $("body").scrollTop(0); }
});


$(document).ready(function () {
    $("input[id^='typeID_']").on("click", function (event) {
        //menuTypeHandler(this.id); subTypeID
        filtersHandler();
    });

    $("input[id^='subTypeID_']").on("click", function (event) {
        //menuTypeHandler(this.id); subTypeID
        filtersHandler();
    });

    $("input[id^='regionID_']").on("click", function (event) {
        regionsFilterHandler(this.id);
    });

    $("input[id^='cbCity_']").on("click", function (event) {
        citiesFilterHandler(this.id);
    });

    $("body").on("click", "li[id^='liMainShowID_']", function (event) {
        editShowHandler(this.id, '');
    });

    $("#txtSearch").on("keyup", function (event) {
        searchShowByText($("#txtSearch").val());
    });

    $("#liSortByPrice").on("click", function (event) {
        event.preventDefault();
        sortByHandler("liSortByPrice", "spanSortByPriceAlt_desc", "spanSortByPrice_asc");
    });

    $("#liSortByName").on("click", function (event) {
        event.preventDefault();
        sortByHandler("liSortByName", "spanSortByNameAlt_desc", "spanSortByName_asc");
    });

    $("#liSortBySection").on("click", function (event) {
        event.preventDefault();
        sortByHandler("liSortBySection", "spanSortBySectionAlt_desc", "spanSortBySection_asc");
    });

    $("#liSortByDate").on("click", function (event) {
        event.preventDefault();
        sortByHandler("liSortByDate", "spanSortByDateAlt_desc", "spanSortByDate_asc");
    });

    $("#liSuperPrice").on("click", function (event) {
        filtersHandler();
    });

    $("#liDiscount").on("click", function (event) {
        filtersHandler();
    });

    $("#liTour").on("click", function (event) {               
        filtersHandler();
    });

    $("#btnEditShowClose").on("click", function (event) {
        editClose();
    });

    $("#txtDateFrom").on("change", function (event) {
       
        var datef = $("#txtDateFrom").val(), validateDate = true;        

        if(datef.length > 0)
        {
            validateDate = validateData(datef);
        }
                
        if(!validateDate)
        {
            alert("wrong date! ");
            return false;
        }

        var dateTo = $("#txtDateTo").datepicker('getDate');

        if(dateTo == '' || dateTo == null)
        {
            $("#txtDateTo").datepicker('setDate', $("#txtDateFrom").datepicker('getDate'));
        }        

        leftFilterDateHandler(true);
        
    });

    $("#txtDateTo").on("change", function (event) {

        var datet = $("#txtDateTo").val(), validateDate = true;

        if(datet.length > 0)
        {
            validateDate = validateData(datet);
        }
                
        if(!validateDate)
        {
            alert("wrong date! ");
            return false;
        }

        leftFilterDateHandler(true);
    });

    $("#aClearTopFilter").on("click", function (event) {
        event.preventDefault();
        clearTopFilter();
    });

    $("#aClearLeftFilter").on("click", function (event) {
        event.preventDefault();
        clearLeftFilter();
    });

    $("input[id^='inputLeftFilter_'").on("click", function (event) {
        
        leftFilterDateHandler(false);
    });

    $("#inputPriceMin").on("keyup", function (event) {
        this.value = this.value.replace(/[^0-9\.]/g,'');

        if(this.value.length > 1)
        {
            leftFilterPriceHandler();
        }
    });

    $("#inputPriceMax").on("keyup", function (event) {
        this.value = this.value.replace(/[^0-9\.]/g,'');

        if(this.value.length > 1)
        {
            leftFilterPriceHandler();
        }
    });

    $("body").on("click", "a[id^='aSeancePay_']", function (event){
        event.preventDefault();
        showSeancePayPage(this.id);
    });    

    $("#aCloseEditShow, #btnCloseEditShow").on("click", function (event) {
        event.preventDefault();
        editClose();
    });

    $("#aBackToEdit").on("click", function(event){
        event.preventDefault();
        $("#iframeSeancePayPage").prop("src", '');
        $("#divSeancePayPage").hide();
        $("#divEditShowBody").show();
        $("#aBackToEdit").hide();
    });

    $("#liHomePage").on("click", function(event){
        $("#divAboutContent").hide();
        $("#divMainContent").show();
        $("#liAboutPage").removeClass('active');
        $("#liHomePage").addClass('active');
    });

    $("#liAboutPage").on("click", function(event){
        $("#divMainContent").hide();
        $("#divAboutContent").show();
        $("#liHomePage").removeClass('active');
        $("#liAboutPage").addClass('active');
    });

    $("body").on("click", "#btnShowMore", function(event){     
        var arrShows = $("li[id^='liMainShowID_']");
        $("#liShowMore").hide();
        $.each(arrShows, function(i,v){
            $(v).show();
        });
    });
    
    $("#aShowShareLink").on("click", function(event){
        
        event.preventDefault();

        if($("#lblShowShareLink").is(":visible"))
        {
            $("#lblShowShareLink").hide();
        }
        else
        {
            $("#lblShowShareLink").show();
        }
    });

    $("#aAboutPage, #aHomePage").on("click", function(event)
    { 
        event.preventDefault(); 
    });

    $("body").on("click", "a[id^='aShowMedia']", function (event)
    { 
        event.preventDefault(); 
    });

    $("#inpShowShareLink").on("focus", function(event){
        this.select();
    });

     $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
     });
    // scroll body to 0px on click
    $('#back-to-top').click(function () {
        $('#back-to-top').tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
        
    $('#back-to-top').tooltip('show');

    directLink();
});

function sortByHandler(parentID, param1ID, param2ID) {
    if ($("#" + param1ID).is(":visible")) {
        $("#" + param1ID).hide();
        $("#" + param2ID).show();
    }
    else {
        $("#" + param1ID).show();
        $("#" + param2ID).hide();
    }

    $("#hdnSortElement").text('');
    $("#hdnSortElement").text(parentID);

    filtersHandler();
}

function menuTypeHandler(id) {
    var arrTypes = $("li[id^='liTypeID_']");
    var arrChecked = [];
    //var url = "/getShowsByType?types=";
    var url = "/getShowsByType";
    var urlParams = "";

    $.each(arrTypes, function (index, value) {

        var input = $(value).find("input[type='checkbox']");
        var isChecked = $(input).is(':checked');
        var typeID = $(input).attr("id").split("_")[1];

        $("#subMenuOfType_" + typeID).hide();

        if (isChecked) {
            arrChecked.push(typeID);
            $("#subMenuOfType_" + typeID).show();
        }

    });

    var data = {};
    data.ids = arrChecked.join();
    sendDataToServer(url, data, menuTypeHandlerCallbackSuccess, null);

    //urlParams = arrChecked.join();

    // var u = url + urlParams;
    // $("#formTypeMenu").attr("url", "");
    // $("#formTypeMenu").attr("url", u);
    // var a = $("#formTypeMenu").attr("url");
    //$("#formTypeMenu").attr("url", u).submit();    
}

function createShowHTML(arrShows, arrShowsSections) {

    var html = "", arrDisplayShows = [];

    $("#ulShows").empty();
    $("#ulShows li").remove();

    $.each(arrShows, function (index, value) {
        
        var existsShow = arrDisplayShows.findIndex(x => x === value.show_id);

        if(existsShow != -1)
        {
            return;
        }

        arrDisplayShows.push(value.show_id);
        var type = '', subtype = '', type_id = '', subtype_id = '', type_color = '', subtypeHTML = '', imageURL = '', showName = '', date_f = '', date_t = '';
        // for (var s = 0; s < arrShowsSections.length; s++) {
        //     if (value.show_id == arrShowsSections[s].show_id && value.type_name == arrShowsSections[s].type_name && value.subtype_name == arrShowsSections[s].subtype_name) {
        //         type = arrShowsSections[s].type_name;
        //         type_id = arrShowsSections[s].type_id;
        //         type_color = arrShowsSections[s].color;
        //         subtype = arrShowsSections[s].subtype_name;
        //         subtype_id = arrShowsSections[s].subtype_id;
        //     }
        // }

        // if (value.subcategory_name != 'undefined') {

        //     var arrSubTypes = value.subcategory_name.split('|');
        //     if(arrSubTypes.length > 1){
        //         $.each(arrSubTypes, function(is, vs)
        //         {
        //             //subtypeHTML += "<a href='#' subtype_id='" + value.subtype_id + "' style='background:" + value.type_color + "; color:white; width:65px; font-size: 8pt; text-transform: uppercase; margin-right:3px;'>" + vs + "</a>"
        //         });
        //     }
        //     else
        //     {
        //         //subtypeHTML = "<a href='#' subtype_id='" + value.subtype_id + "' style='background:" + value.type_color + "; color:white; width:65px; font-size: 8pt; text-transform: uppercase;'>" + value.subtype_name + "</a>"
        //     }

        // }

        if (value.resource == 'bravo') {
            imageURL = "http://kaccabravo.co.il" + value.main_image;
        }
        else {
            imageURL = "http://biletru.co.il" + value.main_image;
        }

        if (value.name.length > 50) {
            var n = value.name.substr(0, 50);
            showName = n.substr(0, n.lastIndexOf(" "));
        }
        else {
            showName = value.name;
        }

        date_f = $.datepicker.formatDate("dd.mm.yy", new Date(value.date_from));
        date_t = $.datepicker.formatDate("dd.mm.yy", new Date(value.date_to));

        var date_ft = date_f != date_t ? date_f + " - " + date_t : date_f;
        var show_price = value.price_min != value.price_max ? value.price_min + "&#8362; - " + value.price_max + "&#8362;" : value.price_min + "&#8362;";
        var displayEvent = ''; 

        if(index == 40 )
        {
            html += "<li id='liShowMore' style='width:100%; text-align:center; padding-bottom:10px;'>" +                        
                          "<button id='btnShowMore' style='cursor: pointer; text-transform: uppercase; color:black; width: 350px; margin-top: 20px;'>Показать ещё</button>"+                        
                    "</li>";
        }

        if(index >= 40)
        {
            displayEvent = "display:none;";
        }

        html += "<li id='liMainShowID_" + value.show_id + "' style='height: 285px; border: solid 0px red; cursor: pointer; "+ displayEvent +" ' class='col-sm-3'>" +
            "<div>" +
            "<div class='text-left'>" +
            // "<a href='#' type_id='" + value.type_id + "' style='background:" + value.type_color + "; color:white; margin-right:5px; width:65px; font-size: 8pt;'>" + value.type_name + "</a>" +
            // subtypeHTML +
            "</div>" +
            "<div class='thumbnail'>" +
            "<img src='" + imageURL + "' alt='' style='width: 198px; height: 110px;'>" +
            "<div class='caption'>" +
            "<p style='height:54px; max-height:54px; min-height:54px;'>" + showName + "</p>" +
            "<p>" + date_ft + "</p>" +
            "<p>Цена " + show_price + "</p>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</li>";
    });

    $("#ulShows").append(html);
}

function menuTypeHandlerCallbackSuccess(data) {
    createShowHTML(data.shows, data.showsSections);
}

function editShowHandler(showID, showCode) {
    var data = {};
    data.id = showID.split("_")[1];
    data.showCode = showCode;
    sendDataToServer('/getShowByID', data, editShowHandlerCallbackSuccess, null);
}

function editShowHandlerCallbackSuccess(data) {    
    $("#divShowEdit").show();
    $("#editShowModal").modal('show');

    fillEditShowHTML(data.show, data.showSeances, data.showMedia);
}

function editClose() {

    $('html head').find('title').text("BILETY.CO.IL – израильская афиша.");
    $("meta[name='description']").attr("content", "BILETY.CO.IL – агрегатор билетов на спектакли, концерты и другие культурные мероприятия в Израиле");
    
    $("#divShowEdit").hide();
    $("#editShowModal").modal('hide');

    $("#iframeSeancePayPage").prop("src", '');
    $("#divSeancePayPage").hide();
    $("#divEditShowBody").show();
    $("#aBackToEdit").hide();
}

function fillEditShowHTML(show, arrShowsSeances, arrMedia) {
    var resource = show[0].resource == "bravo" ? "http://kaccabravo.co.il" : "http://biletru.co.il";

    $('html head').find('title').text(show[0].name + " - bilety.co.il" );
    $("meta[name='description']").attr("content", show[0].announce);

    $("#spanEditShowName").text(show[0].name);

    $("#lblShowShareLink").hide();
    var params = decodeURIComponent(window.location.search.substring(1));
    $("#lblShowShareLink").text("");
  
    $("#lblShowShareLink").text(window.location.href.split('?')[0] +"event/" + show[0].show_code);
    //$("#inpShowShareLink").val(window.location.href.split('?')[0] +"?show=" + show[0].id); 
    
    // if (show[0].second_image != null && show[0].second_image != '') {

    //     var fileType = show[0].second_image.split('.')[1];
    //     if (fileType == 'mp4') {

    //     }
    //     else {
    //         $("#imgEditMain").attr("src", resource + show[0].second_image);
    //     }
    // }
    // else {
    //     $("#imgEditMain").attr("src", resource + show[0].main_image);
    // }

    $("#imgEditMain").attr("src", resource + show[0].main_image);

    $("#pEditShowAnnounce").text(show[0].announce);

    var seanceTableHTML = '';

    $.each(arrShowsSeances, function (index, value) {

        var priceMin = '', priceMax = '', showPrice = '';

        if(value.price_min == value.price_max || value.price_max == "")
        {
            showPrice = "<td>" + value.price_min + "&#8362;</td>";
        }
        else
        {
            showPrice = "<td>" + value.price_min + " - " + value.price_max + "&#8362;</td>";
        }

        if(value.price_max == "" &&  value.price_min == "")
        {
            return;
        }

        var date_seance = $.datepicker.formatDate("dd.mm.yy", new Date(value.date));
        var seance_id = "aSeancePay_"+ value.id;
        var logo_img = show[0].resource == "bravo" ? "<img src='/images/bravo-logo.jpg' alt='bravo' style='width: 35px; height: 25px;'>" : "<img src='/images/biletru-logo.gif' alt='biletru' style='width: 55px; height: 15px;'>";        
        
        seanceTableHTML += "<tr>" +
            "<td>" + value.city + "</td>" +
            "<td>" + date_seance + "&nbsp;" + value.seance_time + "</td>" +
            "<td>" + value.hall + "</td>" +            
            showPrice +
            "<td><a id='" + seance_id + "' href='#' link='"+ value.link +"' style='color: black; cursor: pointer;'> <span style='text-transform: uppercase;'> купить </span> &nbsp; "+ logo_img +" </a></td>" +
            "</tr>";
        
    });

    var arrTrs = $("#tableEditSeances tr");
    $.each(arrTrs, function(index, value){
        if(index > 0){
            $(this).remove();
        }
    });

    $("#tableEditSeances").append(seanceTableHTML);

    var mediaDivHTML = '';
    $.each(arrMedia, function (index, value) {
        
        var img = new Image(), w, h, maxW = 180, maxH = 180, ratio = 0, width = 0, height = 0;
        img.src = resource + value.link;
        img.id = "imgShowMedia_" + value.id;
        img.onload = function()
        {
            w = this.width; 
            h = this.height;

            if(w > maxW)
            {
                ratio = maxW / w;
                $("#"+this.id).css("width", maxW);
                $("#"+this.id).css("height", h * ratio);
            }

            if(h > maxH)
            {
                ratio = maxH / h;                
                $("#"+this.id).css("height", maxH);
                $("#"+this.id).css("width", w * ratio);
            }           

        };        

        mediaDivHTML += "<div class='col-xs-6 col-md-3'>" +
            "<a id='aShowMedia_"+ value.id +"' href='' class='thumbnail'>" +
            "<img id='imgShowMedia_"+ value.id + "' src='" + resource + value.link + "' alt='" + show[0].name + "'></img>" +
            "<a/>" +
            "</div>";
    });

    $("#divEditGalary").empty();
    //$("#divEditGalary").remove();  
    $("#divEditGalary").append(mediaDivHTML);

}

function searchShowByText(text) {
    if (text.length >= 3 || text.length == 0) {
        filtersHandler();
    }
    else {
        return;
    }
}

function searchShowByTextCallbackSuccess(data) {
    createShowHTML(data.shows, data.showsSections);
}

function filtersHandler() {
    var arrTypes = $("li[id^='liTypeID_']");
    var arrSubTypes = $("li[id^='liSubTypeID_']");
    var arrCities = $("li[id^='liCity_']");
    var dateFrom = $("#txtDateFrom").datepicker('getDate');
    var strDateFrom = $.datepicker.formatDate("dd.mm.yy", dateFrom);
    var dateTo = $("#txtDateTo").datepicker('getDate');
    var strDateTo = $.datepicker.formatDate("dd.mm.yy", dateTo);

    var arrTypesChecked = [];
    var arrSubTypesChecked = [];
    var arrCitiesChecked = [];
    var url = "/getShowByFilters";
    var jsonDates = $("#hdnDateFilterData").text();
    var jsonCities = $("#hdnCitiesFilterData").text();

    //price filter
    var superPrice = $("#inputSuperPrice").is(":checked");
    var discount = $("#inputDiscount").is(":checked");
    var tour = $("#inputTour").is(":checked");
    var minPrice = $("#inputPriceMin").val() == '' ? null : parseInt($("#inputPriceMin").val());
    var maxPrice = $("#inputPriceMax").val() == '' ? null : parseInt($("#inputPriceMax").val());

    var count = 0;

    //get checked types
    $.each(arrTypes, function (index, value) {

        var input = $(value).find("input[type='checkbox']");
        var isChecked = $(input).is(':checked');
        var fullID = $(input).attr("id");
        var typeID = $(input).attr("id").split("_")[1];

        $("#subMenuOfType_" + typeID).hide();

        if (isChecked) {
            $("#subMenuOfType_" + typeID).show();
            var subTypesLi = $("#subMenuOfType_" + typeID + " li");
            var subCount = 0;

            $.each(subTypesLi, function (i, v) {

                var inp = $(v).find("input[type='checkbox']");
                var isChk = $(inp).is(':checked');
                var subTypeID = $(inp).attr("id").split("_")[1];

                if (isChk) {
                    arrSubTypesChecked.push(subTypeID);
                    $("#" + fullID).prop('checked', false);
                    $('label[for=' + fullID + ']').removeClass('checked');
                    subCount++;
                }
            });

            arrTypesChecked.push({
                type: typeID,
                subTypes: subCount == 0 ? arrSubTypesChecked = null : arrSubTypesChecked.join()
            });

            count++;
        }
    });

    if (count == 0) {
        arrTypesChecked = null;
    }

    if ($("#hdnSortElement").text() == '') {
        $("#hdnSortElement").text('liSortByPrice');
    }

    var data = {
        cities: jsonCities == '' ? null : jsonCities,
        types: arrTypesChecked == null ? null : arrTypesChecked,
        subtypes: arrSubTypesChecked == null ? null : arrSubTypesChecked.join(),
        //dateFrom: strDateFrom == '' ? null : strDateFrom,
        //dataTo: strDateTo == '' ? null : strDateTo,
        searchText: $("#txtSearch").val() == '' ? null : $("#txtSearch").val(),
        superPrice: superPrice,
        discount: discount,
        sortByPrice: $("#hdnSortElement").text() == 'liSortByPrice' ? getSortDirection("liSortByPrice") : null,
        sortByName: $("#hdnSortElement").text() == 'liSortByName' ? getSortDirection("liSortByName") : null,
        sortByDate: $("#hdnSortElement").text() == 'liSortByDate' ? getSortDirection("liSortByDate") : null,
        sortBySection: $("#hdnSortElement").text() == 'liSortBySection' ? getSortDirection("liSortBySection") : null,
        tour: tour,
        dates: jsonDates == '' ? null : jsonDates,
        minPrice: minPrice,
        maxPrice: maxPrice
    };

    var dd = data;

    sendDataToServer(url, data, menuTypeHandlerCallbackSuccess, null);

}

function getSortDirection(entityID) {
    var elements = $("#" + entityID + " span");
    var sortDirection = "";

    $.each(elements, function (index, value) {
        if ($(value).is(":visible") && $(value).hasClass("glyphicon")) {
            sortDirection = $(value).attr("id").split("_")[1];
        }
    });

    return sortDirection;
}

function clearTopFilter() {    
    $("#txtSearch").val('');
    $("#liSuperPrice").removeClass('active');
    $("#liDiscount").removeClass('active');
    $("#liTour").removeClass('active');

    //sort by price
    $("#spanSortByPriceAlt_desc").show();
    $("#spanSortByPrice_asc").hide();
    $("#hdnSortElement").text('');
    $("#hdnSortElement").text("liSortByPrice");

    //sort by name
    $("#spanSortByName_asc").show();
    $("#spanSortByNameAlt_desc").hide();

    var arrElements = $("li[id^='liCity_']");
    $.each(arrElements, function (i, v) {
        var input = $(v).find("input[type='checkbox']");
        $(input).prop('checked', false);
        $('label[for=' + $(input).attr('id') + ']').removeClass('checked');
    });

    filtersHandler();
}

function clearLeftFilter() {

    var arrElements = $("li[id^='liTypeID_']");
    $.each(arrElements, function (i, v) {
        var input = $(v).find("input[type='checkbox']");
        $(input).prop('checked', false);
        $('label[for=' + $(input).attr('id') + ']').removeClass('checked');
    });

    arrElements = $("li[id^='liSubTypeID_']");
    $.each(arrElements, function (i, v) {
        var input = $(v).find("input[type='checkbox']");
        $(input).prop('checked', false);
        $('label[for=' + $(input).attr('id') + ']').removeClass('checked');
    });

    arrElements = $("li[id^='liCity_']");
    $.each(arrElements, function (i, v) {
        var input = $(v).find("input[type='checkbox']");
        $(input).prop('checked', false);
        $('label[for=' + $(input).attr('id') + ']').removeClass('checked');
    });

    arrElements = $("li[id^='liRegion_']");
    $.each(arrElements, function (i, v) {
        var input = $(v).find("input[type='checkbox']");
        $(input).prop('checked', false);
        $('label[for=' + $(input).attr('id') + ']').removeClass('checked');
        var region = $(v).attr('id').split("_")[1];

        $("#ulCitiesOfRegion_" + region).hide();
    });    

    $("#hdnCitiesFilterData").text('');

    arrElements = $("li[id^='liLeftFilter_']");
    $.each(arrElements, function (i, v) {
        var input = $(v).find("input[type='checkbox']");
        $(input).prop('checked', false);
        $('label[for=' + $(input).attr('id') + ']').removeClass('checked');
    });        

    $("#hdnDateFilterData").text('');
    
    $("#txtDateFrom").val('');
    $("#txtDateTo").val('');
    $("#txtDateFrom").prop('disabled', false);
    $("#txtDateTo").prop('disabled', false);

    $("#inputSuperPrice").prop('checked', false);
    $("label[for='inputSuperPrice']").removeClass('checked');

    $("#inputDiscount").prop('checked', false);
    $("label[for='inputDiscount']").removeClass('checked');

    $("#inputTour").prop('checked', false);
    $("label[for='inputTour']").removeClass('checked');

    $("#inputPriceMin").val('');
    $("#inputPriceMax").val('');
    

    filtersHandler();
}

function leftFilterDateHandler(inputDate)
{
    var arrFilterDates = $("li[id^='liLeftFilter_']");
    var arrFilterDatesResult = [];

    $("#hdnSortElement").text('liSortByDate');

    if($("#spanSortByDateAlt_desc").is(":visible"))
    {
        $("#spanSortByDateAlt_desc").hide();
        $("#spanSortByDate_asc").show();
    }    

    $("#txtDateFrom").prop('disabled', false);
    $("#txtDateTo").prop('disabled', false);   

    if(inputDate)
    {
        var objDate = new Object();
        var dateFrom = $("#txtDateFrom").datepicker('getDate');
        objDate.fDate = $.datepicker.formatDate("dd.mm.yy", dateFrom);
        var dateTo = $("#txtDateTo").datepicker('getDate');
        objDate.tDate = $.datepicker.formatDate("dd.mm.yy", dateTo);

        arrFilterDatesResult.push(objDate);
    }
    else
    {
        $.each(arrFilterDates, function(index, value){
            var input = $(value).find("input[type='checkbox']");
            var isChecked = $(input).is(':checked');
            var elmID = $(value).attr("id").split("_")[1];
            var tDate = new Date(), objDate = new Object();
            
            if(!isChecked)
            {
                return;
            }

            $("#txtDateFrom").prop('disabled', 'true');
            $("#txtDateTo").prop('disabled', 'true');
            $("#txtDateFrom").val('');
            $("#txtDateTo").val('');             

            switch(elmID.toLowerCase())
            {
                case "today":                
                objDate.fDate = $.datepicker.formatDate("dd.mm.yy", tDate); 
                objDate.tDate = $.datepicker.formatDate("dd.mm.yy", tDate);
                arrFilterDatesResult.push(objDate);           
                break;

                case "tomorrow":
                objDate.fDate = $.datepicker.formatDate("dd.mm.yy", new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate() + 1));
                objDate.tDate = $.datepicker.formatDate("dd.mm.yy", new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate() + 1));
                arrFilterDatesResult.push(objDate);
                break;

                case "week":
                objDate.fDate = $.datepicker.formatDate("dd.mm.yy", tDate); 
                objDate.tDate = $.datepicker.formatDate("dd.mm.yy", new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate() + 7));
                arrFilterDatesResult.push(objDate);
                break;

                case "weekend":
                var day = tDate.getDay();
                var dayCount = tDate.getDay() < 4 ? 4 : 11;
                var fdate = dayCount - day;

                fromDate = $.datepicker.formatDate("dd.mm.yy", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + fdate));
                objDate.fDate = fromDate;
                objDate.tDate = $.datepicker.formatDate("dd.mm.yy", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + fdate + 2));

                arrFilterDatesResult.push(objDate);            
                break;

                case "nextweekend":
                var fromDate = '';
                var toDate = '';
                var day = tDate.getDay();
                var dayCount = tDate.getDay() < 4 ? 11 : 18;          
                var fDate = dayCount - day;
                
                var year = new Date().getFullYear(), month = new Date().getMonth(), tday = new Date().getDate() + fDate;
                fromDate = $.datepicker.formatDate("dd.mm.yy", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + fDate));
                toDate = $.datepicker.formatDate("dd.mm.yy", new Date(year, month, tday + 2));
                objDate.fDate = fromDate;
                objDate.tDate = toDate;
                arrFilterDatesResult.push(objDate);
                break;

                case "month":
                objDate.fDate = $.datepicker.formatDate("dd.mm.yy", tDate); 
                objDate.tDate = $.datepicker.formatDate("dd.mm.yy", new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate() + 30));
                arrFilterDatesResult = [];
                arrFilterDatesResult.push(objDate);
                break;

                case "treemonth":
                objDate.fDate = $.datepicker.formatDate("dd.mm.yy", tDate); 
                objDate.tDate = $.datepicker.formatDate("dd.mm.yy", new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate() + 90));
                arrFilterDatesResult = [];
                arrFilterDatesResult.push(objDate);
                break;
            }        
            
        });
     }

     $("#hdnDateFilterData").text(JSON.stringify(arrFilterDatesResult));
     filtersHandler(arrFilterDatesResult);
}

function regionsFilterHandler(regionID)
{
    var rID = regionID.split("_")[1];    
    var arrRegionCities = [], liRegionCities = '', objRegion = new Object(), arrObjRegion = [];
    var arrInputAllRegions = $("input[id^='regionID_']");

    if($("#hdnCitiesFilterData").text() != '')
    {
        arrObjRegion = JSON.parse($("#hdnCitiesFilterData").text());
    }

    if($("#ulCitiesOfRegion_" + rID).is(":visible"))
    {
        $("#ulCitiesOfRegion_" + rID).hide();        
        var regionToRemove = 0;

        $.each(arrObjRegion, function(i, v){
            if(v.regionID == rID)
            {
               regionToRemove = i;
            }
        });

        arrObjRegion.splice(regionToRemove, 1);

    }
    else
    {
        $("#ulCitiesOfRegion_" + rID).show();
        liRegionCities = $("#ulCitiesOfRegion_" + rID + " li");        

        $.each(liRegionCities, function(i, v){
            var cityID = $(v).prop("id").split("_")[1];
            arrRegionCities.push(cityID);
        });

        objRegion.regionID = rID;
        objRegion.cities = arrRegionCities;

        arrObjRegion.push(objRegion);
    }

    $("#hdnCitiesFilterData").text('');
    $("#hdnCitiesFilterData").text(JSON.stringify(arrObjRegion));
    var c = $("#hdnCitiesFilterData").text();
    filtersHandler();
    
}

function citiesFilterHandler(cityID)
{
    var region = $("#"+cityID).attr("region");

    if($("label[for='regionID_" + region + "']").hasClass('checked'))
    {
        $("#regionID_"+ region).prop('checked', false);
        $("label[for='regionID_" + region + "']").removeClass('checked');
    }

    var arrObjRegion = JSON.parse($("#hdnCitiesFilterData").text());

    $.each(arrObjRegion, function(i,v){
        if(v.regionID == region)
        {
            v.cities = [];
            var arrCitiesInput = $("input[region='"+ region +"']");

            $.each(arrCitiesInput, function(ic, vc){
                if($(vc).is(":checked"))
                {
                    v.cities.push($(vc).attr("id").split("_")[1]);
                }
            });

            if(v.cities.length == 0)
            {
                $("#ulCitiesOfRegion_" + region).hide();
            }
        }        
    });
    
    $("#hdnCitiesFilterData").text('');
    $("#hdnCitiesFilterData").text(JSON.stringify(arrObjRegion));   

    var d = $("#hdnCitiesFilterData").text(); 
    filtersHandler();  
    
}

function leftFilterPriceHandler()
{
   var minPrice = $("#inputPriceMin").val() == '' ? 0 : parseInt($("#inputPriceMin").val());
   var maxPrice = parseInt($("#inputPriceMax").val());

   if(minPrice > maxPrice && maxPrice != 0)
   {
      return;
   }
   else
   {
      filtersHandler();
   }
}

function validateData(dateText)
{
    var vDay = new Date().getDate(), vMonth = new Date().getMonth(), vYear = new Date().getFullYear(), result = true;

    if(dateText.length != 10)
    {
        result = false;        
    }

    var arrDateParts = dateText.split("/");

    if(arrDateParts.length != 3)
    {
        return false;
    }

    //day
    if(arrDateParts[0].length != 2)
    {
        return false;
    }

    var day = parseInt(arrDateParts[0]);

    if(day > 31 || day < 1 || (day < vDay && arrDateParts[1] == vMonth))
    {
        return false;
    }

    //month
    if(arrDateParts[1].length != 2)
    {
        return false;
    }

    var month = parseInt(arrDateParts[1]);

    if(month > 12 || month < 1 || (month < vMonth && arrDateParts[2] == vYear))
    {
        return false;
    }

    //year
    if(arrDateParts[2].length > 4)
    {
        return false;
    }

    var year = parseInt(arrDateParts[2]);      
    
    if(year < vYear)
    {
        return false;
    }

    return result;
}

function showSeancePayPage(id)
{    
    var payLink = $("#" + id).attr("link");    
    $("#iframeSeancePayPage").prop("src", payLink);
    $("#divSeancePayPage").show();
    $("#divEditShowBody").hide();
    $("#aBackToEdit").show();
}

function imageSizeHandler()
{
    arrImg = $("#divEditGalary img");

    $.each(arrImg, function(i, v){
        var width = $(this).width();    
        var height = $(this).height();
    });
}
 
function directLink()
{   
    var params = decodeURIComponent(window.location.search.substring(1));
    var agent = navigator.userAgent;    
    
   // alert(agent);

    if(params == "")
    {
        return;
    }

    if(params.split("=")[0] != "show")
    {
        return;
    }
    
    var showCode = params.split('=')[1];
    editShowHandler('', showCode);
}

function sendDataToServer(path, data, callbackSuccess, callbackError) {
    try {
        $.ajax({
            url: path,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(data),
            success: function (response) {
                if (callbackSuccess != null || callbackSuccess != '') {
                    callbackSuccess(response);
                }
            },
            error: function (error) {
                if (callbackError != null && callbackError != '') {
                    callbackError(error);
                }
            }
        });

    } catch (error) {
        console.error("sendDataToServer error: ", error)
    }
}
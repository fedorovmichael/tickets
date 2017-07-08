

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
        editShowHandler(this.id);
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
    var html = "";

    $("#ulShows").empty();
    $("#ulShows li").remove();

    $.each(arrShows, function (index, value) {

        var type = '', subtype = '', type_id = '', subtype_id = '', type_color = '', subtypeHTML = '', imageURL = '', showName = '', date_f = '', date_t = '';
        for (var s = 0; s < arrShowsSections.length; s++) {
            if (value.show_id == arrShowsSections[s].show_id) {
                type = arrShowsSections[s].type_name;
                type_id = arrShowsSections[s].type_id;
                type_color = arrShowsSections[s].color;
                subtype = arrShowsSections[s].subtype_name;
                subtype_id = arrShowsSections[s].subtype_id;
            }
        }

        if (subtype != 'undefined') {
            subtypeHTML = "<a href='#' subtype_id='" + subtype_id + "' style='background:" + type_color + "; color:white; width:65px; font-size: 10pt;'>" + subtype + "</a>"
        }

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

        html += "<li id='liMainShowID_" + value.show_id + "' style='height: 285px; border: solid 0px red; cursor: pointer;' class='col-sm-3'>" +
            "<div>" +
            "<div class='text-left'>" +
            "<a href='#' type_id='" + type_id + "' style='background:" + type_color + "; color:white; margin-right:5px; width:65px; font-size: 10pt;'>" + type + "</a>" +
            subtypeHTML +
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

function editShowHandler(showID) {
    var data = {};
    data.id = showID.split("_")[1];
    sendDataToServer('/getShowByID', data, editShowHandlerCallbackSuccess, null);
}

function editShowHandlerCallbackSuccess(data) {    
    $("#divShowEdit").show();
    $("#editShowModal").modal('show');

    fillEditShowHTML(data.show, data.showSeances, data.showMedia);
}

function editClose() {    
    $("#divShowEdit").hide();
    $("#editShowModal").modal('hide');
}

function fillEditShowHTML(show, arrShowsSeances, arrMedia) {
    var resource = show[0].resource == "bravo" ? "http://kaccabravo.co.il" : "http://biletru.co.il";

    $("#spanEditShowName").text(show[0].name);

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
        
        seanceTableHTML += "<tr>" +
            "<td>" + value.city + "</td>" +
            "<td>" + value.date + "&nbsp;" + value.seance_time + "</td>" +
            "<td>" + value.hall + "</td>" +            
            showPrice +
            "<td><a href='#'>КУПИТь</a></td>" +
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

        mediaDivHTML += "<div class='col-xs-6 col-md-3'>" +
            "<a href='#' class='thumbnail'>" +
            "<img style='width:180px; height:180px;' src='" + resource + value.link + "' alt='" + show[0].name + "'></img>" +
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

    if(day > 31 || day < 1 || day < vDay)
    {
        return false;
    }

    //month
    if(arrDateParts[1].length != 2)
    {
        return false;
    }

    var month = parseInt(arrDateParts[1]);

    if(month > 12 || month < 1 || month < vMonth)
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
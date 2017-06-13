
$(document).ready(function(){
    $("input[id^='typeID_']").on("click", function(event){             
        //menuTypeHandler(this.id); subTypeID
        filtersHandler();
    });

    $("input[id^='subTypeID_']").on("click", function(event){             
        //menuTypeHandler(this.id); subTypeID
        filtersHandler();
    });

    $("input[id^='cbCity_']").on("click", function(event){            
        filtersHandler();
    });

    $("body").on("click", "li[id^='liMainShowID_']", function(event){
        editShowHandler(this.id);
    });   

    $("#txtSearch").on("keyup", function(event){
        searchShowByText($("#txtSearch").val());
    });

    $("#liSortByPrice").on("click", function(event){
        event.preventDefault();
        sortByHandler("liSortByPrice", "spanSortByPriceAlt_desc", "spanSortByPrice_asc");        
    });

    $("#liSortByName").on("click", function(event){
        event.preventDefault();
        sortByHandler("liSortByName", "spanSortByNameAlt_desc", "spanSortByName_asc");
    });

    $("#liSuperPrice").on("click", function(event){
        event.preventDefault();
        priceFilterHandler(this.id);
    });

    $("#liDiscount").on("click", function(event){
        event.preventDefault();
        priceFilterHandler(this.id);
    });

    $("#liTour").on("click", function(event){
        event.preventDefault();
        $("#liTour").hasClass('active') ? $("#liTour").removeClass('active') : $("#liTour").addClass('active');
        filtersHandler();
    });

    $("#btnEditShowClose").on("click", function(event){
        editClose();
    });

    $("#txtDateFrom").on("change", function(event){
        filtersHandler();
    });

    $("#txtDateTo").on("change", function(event){
        filtersHandler();
    });

    $("#aClearTopFilter").on("click", function(event){
        event.preventDefault();
        clearTopFilter();
    });

    $("#liLeftFilter_Today").on("click", function(event){
        event.preventDefault();
        leftFilterToday();
    });

    $("#liLeftFilter_Tomorrow").on("click", function(event){
        event.preventDefault();
        leftFilterTomorrow();
    });

    $("#liLeftFilter_Week").on("click", function(event){
        event.preventDefault();
        leftFilterWeek();
    });

    $("#liLeftFilter_Weekend").on("click", function(event){
        event.preventDefault();
        leftFilterWeekend();
    });
   
    $("#liLeftFilter_NextWeekend").on("click", function(event){
        event.preventDefault();
        leftFilterNextWeekend();
    });
    
    $("#liLeftFilter_Month").on("click", function(event){
        event.preventDefault();
        leftFilterMonth();
    });
   
    $("#liLeftFilter_TreeMonth").on("click", function(event){
        event.preventDefault();
        leftFilterTreeMonth();
    });
    
    
});

function sortByHandler(parentID, param1ID, param2ID)
{
    if($("#" + param1ID).is(":visible"))
    {
        $("#" + param1ID).hide();
        $("#" + param2ID).show();
    }
    else
    {
        $("#" + param1ID).show();
        $("#" + param2ID).hide();
    }

    // if(!$("#"+ parentID).hasClass("active")){
    //     $("#" + parentID).addClass("active");
    // }


    $("#hdnSortElement").text('');
    $("#hdnSortElement").text(parentID);

    filtersHandler();
}

function priceFilterHandler(entityID)
{
    if(!$("#"+ entityID).hasClass('active'))
    {    
        $("#liSuperPrice").removeClass('active');
        $("#liDiscount").removeClass('active');
        $("#"+ entityID).addClass('active');
    }
    else
    {
        $("#"+ entityID).removeClass('active');
    }

    filtersHandler();
}

function menuTypeHandler(id)
{ 
    var arrTypes = $("li[id^='liTypeID_']");
    var arrChecked = [];
    //var url = "/getShowsByType?types=";
    var url = "/getShowsByType";
    var urlParams = "";

    $.each(arrTypes, function(index, value){
        
        var input = $(value).find("input[type='checkbox']");
        var isChecked = $(input).is(':checked');
        var typeID = $(input).attr("id").split("_")[1];

        $("#subMenuOfType_"+ typeID).hide();

        if(isChecked)
        {            
            arrChecked.push(typeID);         
            $("#subMenuOfType_"+ typeID).show();
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

function createShowHTML(arrShows, arrShowsSections)
{
    var html = "";

    $("#ulShows").empty();
    $("#ulShows li").remove();  

    $.each(arrShows, function(index, value){

       var type='', subtype='', type_id='', subtype_id='', type_color='', subtypeHTML = '', imageURL = '', showName='', date_f='', date_t='';
          for(var s = 0; s < arrShowsSections.length; s++){        
            if(value.show_id == arrShowsSections[s].show_id){                   
                type = arrShowsSections[s].type_name;
                type_id = arrShowsSections[s].type_id;
                type_color = arrShowsSections[s].color;
                subtype = arrShowsSections[s].subtype_name;
                subtype_id = arrShowsSections[s].subtype_id;                   
            }
          }

          if(subtype != 'undefined')
          {
              subtypeHTML  = "<a href='#' subtype_id='"+ subtype_id +"' style='background:"+ type_color +"; color:white; width:65px; font-size: 10pt;'>" + subtype + "</a>"
          }

          if(value.resource == 'bravo')
          {
              imageURL = "http://kaccabravo.co.il" + value.main_image;
          }
          else
          {
              imageURL = "http://biletru.co.il" + value.main_image;
          }

          if(value.name.length > 50)
          {
              var n = value.name.substr(0, 50);
              showName = n.substr(0, n.lastIndexOf(" "));
          }
          else
          {
              showName = value.name;
          }
                    
          date_f = $.datepicker.formatDate("dd.mm.yy", new Date(value.date_from));          
          date_t = $.datepicker.formatDate("dd.mm.yy", new Date(value.date_to));

        html+="<li id='liMainShowID_" + value.show_id + "' style='height: 285px; border: solid 0px red;' class='col-sm-3'>" +
                "<div>"+ 
                  "<div class='text-left'>" + 
                    "<a href='#' type_id='"+ type_id +"' style='background:"+ type_color +"; color:white; margin-right:5px; width:65px; font-size: 10pt;'>"+ type +"</a>" +
                    subtypeHTML + 
                  "</div>" + 
                  "<div class='thumbnail'>" +
                    "<img src='"+ imageURL +"' alt='' style='width: 198px; height: 110px;'>" +
                    "<div class='caption'>" + 
                        "<p style='height:54px; max-height:54px; min-height:54px;'>"+ showName +"</p>" +
                        "<p>"+ date_f +" - "+ date_t +"</p>" +
                        "<p>Цена "+ value.price_min +"&#8362; - "+ value.price_max +"&#8362;</p>" +
                    "</div>" +
                   "</div>" +
                  "</div>" +
                  "</li>";
    });

     $("#ulShows").append(html);
}

function menuTypeHandlerCallbackSuccess(data)
{
    createShowHTML(data.shows, data.showsSections);
}

function editShowHandler(showID)
{
    var data = {};
    data.id = showID.split("_")[1];
    sendDataToServer('/getShowByID', data, editShowHandlerCallbackSuccess, null);
}

function editShowHandlerCallbackSuccess(data)
{
    $("#divShowsMain").hide();
    $("#divShowEdit").show();

    fillEditShowHTML(data.show, data.showSeances, data.showMedia);
}

function editClose()
{
    $("#divShowsMain").show();
    $("#divShowEdit").hide();
}

function fillEditShowHTML(show, arrShowsSeances, arrMedia)
{
    var resource = show[0].resource == "bravo" ? "http://kaccabravo.co.il" : "http://biletru.co.il";
    
    $("#spanEditShowName").text(show[0].name);
    
    if(show[0].second_image != null && show[0].second_image != ''){
    
    var fileType = show[0].second_image.split('.')[1];
    if(fileType == 'mp4')
    {
        
    }
    else
    {
        $("#imgEditMain").attr("src", resource + show[0].second_image);
    }
    }
    else{
    $("#imgEditMain").attr("src", resource + show[0].main_image);
    }

    $("#pEditShowAnnounce").text(show[0].announce);

    var seanceTableHTML = '';

    $.each(arrShowsSeances, function(index, value){
        seanceTableHTML+="<tr>" + 
        "<td>"+ value.city +"</td>" +
        "<td>"+ value.date +"&nbsp;"+ value.seance_time +"</td>" +
        "<td>"+ value.hall +"</td>" +
        "<td>"+ value.price_min + " - "+ value.price_max +"</td>" +
        "<td><a href='#'>КУПИТь</a></td>" +
        "</tr>";
    });

    $("#tableEditSeances").append(seanceTableHTML);

    var mediaDivHTML = '';
    $.each(arrMedia, function(index, value){

        mediaDivHTML += "<div class='col-xs-6 col-md-3'>"+
                        "<a href='#' class='thumbnail'>"+
                            "<img style='width:180px; height:180px;' src='"+ resource + value.link + "' alt='"+ show[0].name +"'></img>" +
                        "<a/>" +         
                    "</div>";
    });

    $("#divEditGalary").empty();
    //$("#divEditGalary").remove();  
    $("#divEditGalary").append(mediaDivHTML);

}

function searchShowByText(text)
{
    if(text.length >= 3 || text.length == 0)
    {
        filtersHandler();        
    }
    else
    {
        return;
    }
}

function searchShowByTextCallbackSuccess(data)
{
    createShowHTML(data.shows, data.showsSections);
}

function filtersHandler()
{
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

    //active
    var superPrice = $("#liSuperPrice").hasClass("active");
    var discount = $("#liDiscount").hasClass("active");
    var tour = $("#liTour").hasClass("active");
    var count = 0;

    //get checked types
    $.each(arrTypes, function(index, value){
        
        var input = $(value).find("input[type='checkbox']");
        var isChecked = $(input).is(':checked');
        var typeID = $(input).attr("id").split("_")[1];

        $("#subMenuOfType_"+ typeID).hide();

        if(isChecked)
        {          
            $("#subMenuOfType_"+ typeID).show();
            var subTypesLi = $("#subMenuOfType_"+ typeID + " li");
            var subCount = 0;

            $.each(subTypesLi, function(i, v){

                var inp = $(v).find("input[type='checkbox']");
                var isChk = $(inp).is(':checked');
                var subTypeID = $(inp).attr("id").split("_")[1];

                if(isChk)
                {
                    arrSubTypesChecked.push(subTypeID);
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

    if(count == 0)
    { 
      arrTypesChecked = null;
    }

    //get cities checked
    count = 0;
    $.each(arrCities, function(index, value){

        var input = $(value).find("input[type='checkbox']");
        var isChecked = $(input).is(':checked');
        var cityID = $(value).attr("id").split("_")[1];       

        if(isChecked)
        {            
            arrCitiesChecked.push(cityID);
            count++;     
        }
    });

    if(count == 0)
    { 
      arrCitiesChecked = null;
    }

    if($("#hdnSortElement").text() == '')
    {
        $("#hdnSortElement").text('liSortByPrice');
    }

    var data = {
        cities: arrCitiesChecked == null ? null : arrCitiesChecked.join(),
        types: arrTypesChecked == null ? null : arrTypesChecked,
        subtypes: arrSubTypesChecked == null ? null : arrSubTypesChecked.join(),
        dateFrom: strDateFrom == '' ? null :  strDateFrom,
        dataTo: strDateTo == '' ? null : strDateTo,
        searchText: $("#txtSearch").val() == '' ? null : $("#txtSearch").val(),
        superPrice: superPrice,
        discount: discount,
        sortByPrice: $("#hdnSortElement").text() == 'liSortByPrice' ? getSortDirection("liSortByPrice") : null,
        sortByName: $("#hdnSortElement").text() == 'liSortByName' ? getSortDirection("liSortByName") : null,
        tour: tour
    };

    var dd = data;

    sendDataToServer(url, data, menuTypeHandlerCallbackSuccess, null);

}

function getSortDirection(entityID)
{
    var elements = $("#" + entityID + " span");
    var sortDirection = "";

    $.each(elements, function(index, value){
        if($(value).is(":visible") && $(value).hasClass("glyphicon"))
        {
            sortDirection = $(value).attr("id").split("_")[1];
        }
    });
    
    return sortDirection;    
}

function clearTopFilter()
{
    $("#txtDateFrom").val('');
    $("#txtDateTo").val('');
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
    $.each(arrElements, function(i, v){
        var input = $(v).find("input[type='checkbox']");
        input.checked = false;
        $('label[for='+$(input).attr('id')+']').removeClass('checked');
    });

    filtersHandler();
}

function leftFilterToday()
{
    $("#txtDateFrom").datepicker("setDate", new Date());
    $("#txtDateTo").datepicker("setDate", new Date());

   filtersHandler();
}

function leftFilterTomorrow()
{
    $("#txtDateFrom").datepicker("setDate", 1);
    $("#txtDateTo").datepicker("setDate", 1);

    filtersHandler();
}

function leftFilterWeek()
{
    $("#txtDateFrom").datepicker("setDate", new Date());
    $("#txtDateTo").datepicker("setDate", 7);

    filtersHandler();
}

function leftFilterWeekend()
{
    var tDate = new Date();
    var fromDate = '';
    var toDate = '';
    var day = 0;

    for(var i = 0; i < 7; i++)
    {       
        day = tDate.getDay() + i;       

        if(day == 4)
        {
            fromDate = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate() + i);
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + 2);
            $("#txtDateFrom").datepicker("setDate", fromDate);
            $("#txtDateTo").datepicker("setDate", toDate);           
        }
    }    

    filtersHandler();
}

function leftFilterNextWeekend()
{   
    var tDate = new Date();
    var fromDate = '';
    var toDate = '';
    var day = 0;
    var weekCount = 1;
    var dayCount = 1; 
 
    for(var w = 0; w < 2; w++)
    {
        for(var i = 0; i < 6; i++)
        {       
            day = tDate.getDay() + i;       

            if(day == 6)
            {
                weekCount ++;
                dayCount += i;
                break;
            }

            if(weekCount == 2 && day == 4)
            {
                dayCount += day;
                fromDate = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate() + dayCount);
                toDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + 2);
                $("#txtDateFrom").datepicker("setDate", fromDate);
                $("#txtDateTo").datepicker("setDate", toDate); 
            }
        }
    }
    
    filtersHandler();
}

function leftFilterMonth()
{    
    $("#txtDateFrom").datepicker("setDate", new Date());
    $("#txtDateTo").datepicker("setDate", 30);

    filtersHandler();
}

function leftFilterTreeMonth()
{
    $("#txtDateFrom").datepicker("setDate", new Date());
    $("#txtDateTo").datepicker("setDate", 90);

    filtersHandler();
}

function sendDataToServer(path, data, callbackSuccess, callbackError)
{
    try 
    {
        $.ajax({
            url: path,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(data),
            success: function(response)
            {
                if(callbackSuccess != null || callbackSuccess != '')
                    {  
                        callbackSuccess(response);
                    }
            },
            error: function(error)
            {
                if(callbackError != null && callbackError != '')
                {
                    callbackError(error);
                }
            }
        });
        
    } catch (error) {
        console.error("sendDataToServer error: ", error)
    }
}
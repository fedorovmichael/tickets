
$(document).ready(function(){
    $("input[id^='typeID_']").on("click", function(event){             
        menuTypeHandler(this.id);
    });

    $("body").on("click", "li[id^='liMainShowID_']", function(event){
        editShowHandler(this.id);
    });   

    $("#btnSearch").on("click", function(event){
        searchShowByText($("#txtSearch").val());
    });

});


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

        if(isChecked)
        {
            var typeID = $(input).attr("id").split("_")[1];
            arrChecked.push(typeID);         
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

       var type='', subtype='', type_id='', subtype_id='', type_color='', subtypeHTML = '', imageURL = '', showName='';
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
              subtypeHTML  = "<a href='#' subtype_id='"+ subtype_id +"' style='background:#FF1005; color:white; width:65px;'>" + subtype + "</a>"
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

        html+="<li id='liMainShowID_" + value.show_id + "' style='height: 285px; border: solid 0px red;' class='col-sm-3'>" +
                "<div>"+ 
                  "<div class='text-left'>" + 
                    "<a href='#' type_id='"+ type_id +"' style='background:"+ type_color +"; color:white; margin-right:5px; width:65px;'>"+ type +"</a>" +
                    subtypeHTML + 
                  "</div>" + 
                  "<div class='thumbnail'>" +
                    "<img src='"+ imageURL +"' alt='' style='width: 198px; height: 110px;'>" +
                    "<div class='caption'>" + 
                        "<p style='height:54px; max-height:54px; min-height:54px;'>"+ showName +"</p>" +
                        "<p>"+ value.date_from +" - "+ value.date_to +"</p>" +
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

 function fillEditShowHTML(show, arrShowsSeances, arrMedia)
 {
     var resource = show[0].resource == "bravo" ? "http://kaccabravo.co.il" : "http://biletru.co.il";
     
     $("#divEditShowName").text(show[0].name);
     
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
    var data = {};
    data.text = text;
    sendDataToServer('/getSearchShowByText', data, searchShowByTextCallbackSuccess, null);
}

function searchShowByTextCallbackSuccess(data)
{
    createShowHTML(data.shows, data.showsSections);
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
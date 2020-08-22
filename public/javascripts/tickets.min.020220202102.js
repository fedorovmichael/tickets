var typeNameValueDictionary = {};
var subTypeNameValueDictionary = {};
$(document).on({
	ajaxStart: function() {
		$("#divLoading").addClass("wait-modal");
		$("#divLoading").removeClass("wait-modal-none")
	},
	ajaxComplete: function() {
		$("#divLoading").removeClass("wait-modal");
		$("#divLoading").addClass("wait-modal-none");
		$("body").scrollTop(0)
	}
});
$(document).ready(function() {
	$("input[id^='typeID_']").on("click", function(event) {
		filtersHandler()
	});
	$("input[id^='subTypeID_']").on("click", function(event) {
		filtersHandler()
	});
	$("input[id^='regionID_']").on("click", function(event) {
		regionsFilterHandler(this.id)
	});
	$("input[id^='cbCity_']").on("click", function(event) {
		citiesFilterHandler(this.id)
	});
	$("body").on("click", "li[id^='liMainShowID_']", function(event) {
		var showCode = $(this).attr('showcode');
		$("#hdnEditShowID").val('');
		$("#hdnEditShowID").val(showCode);
		editShowHandler(this.id, showCode)
	});
	$("#txtSearchSmall").on("keyup", function(event) {
		searchShowByText($("#txtSearchSmall").val())
	});
	$("#txtSearch").on("keyup", function(event) {
		searchShowByText($("#txtSearch").val())
	});
	$("#btnSortByPrice").on("click", function(event) {
		sortByHandler("btnSortByPrice", "spanSortByPriceAlt_desc", "spanSortByPrice_asc")
	});
	$("#btnSortByName").on("click", function(event) {
		sortByHandler("btnSortByName", "spanSortByNameAlt_desc", "spanSortByName_asc")
	});
	$("#btnSortBySection").on("click", function(event) {
		sortByHandler("btnSortBySection", "spanSortBySectionAlt_desc", "spanSortBySection_asc")
	});
	$("#btnSortByDate").on("click", function(event) {
		sortByHandler("btnSortByDate", "spanSortByDateAlt_desc", "spanSortByDate_asc")
	});
	$("#liSuperPrice").on("click", function(event) {
		filtersHandler()
	});
	$("#liDiscount").on("click", function(event) {
		filtersHandler()
	});
	$("#liTour").on("click", function(event) {
		filtersHandler()
	});
	$("#btnEditShowClose").on("click", function(event) {
		editClose()
	});
	$("#txtDateFrom").on("change", function(event) {
		var datef = $("#txtDateFrom").val(),
			validateDate = !0;
		if(datef.length > 0) {
			validateDate = validateData(datef)
		}
		if(!validateDate) {
			alert("wrong date! ");
			return !1
		}
		var dateTo = $("#txtDateTo").datepicker('getDate');
		if(dateTo == '' || dateTo == null) {
			$("#txtDateTo").datepicker('setDate', $("#txtDateFrom").datepicker('getDate'))
		}
		leftFilterDateHandler(!0)
	});
	$("#txtDateTo").on("change", function(event) {
		var datet = $("#txtDateTo").val(),
			validateDate = !0;
		if(datet.length > 0) {
			validateDate = validateData(datet)
		}
		if(!validateDate) {
			alert("wrong date! ");
			return !1
		}
		leftFilterDateHandler(!0)
	});
	$("#btnClearTopFilter").on("click", function(event) {
		clearTopFilter()
	});
	$("#aClearLeftFilter").on("click", function(event) {
		event.preventDefault();
		clearLeftFilter()
	});
	$("input[id^='inputLeftFilter_'").on("click", function(event) {
		leftFilterDateHandler(!1)
	});
	$("#inputPriceMin").on("keyup", function(event) {
		this.value = this.value.replace(/[^0-9\.]/g, '');
		if(this.value.length > 1) {
			leftFilterPriceHandler()
		}
	});
	$("#inputPriceMax").on("keyup", function(event) {
		this.value = this.value.replace(/[^0-9\.]/g, '');
		if(this.value.length > 1) {
			leftFilterPriceHandler()
		}
	});
	$("body").on("click", "#btnShowMore", function(event) {
		var arrShows = $("li[id^='liMainShowID_']");
		$("#liShowMore").hide();
		$.each(arrShows, function(i, v) {
			$(v).show()
		})
	});
	$("#aAboutPage, #aHomePage").on("click", function(event) {});
	$("body").on("click", "a[id^='aShowMedia']", function(event) {
		event.preventDefault()
	});
	$("#inpShowShareLink").on("focus", function(event) {
		this.select()
	});
	$(window).scroll(function() {
		if($(this).scrollTop() > 50) {
			$('#back-to-top').fadeIn()
		} else {
			$('#back-to-top').fadeOut()
		}
	});
	$('#back-to-top').click(function() {
		$('#back-to-top').tooltip('hide');
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return !1
	});
	$('#back-to-top').tooltip('show');
	directLink();
	$("#btnSendComment").on("click", function(event) {
		sendComment('creator', null)
	});
	mobileHideFilterButtons();
	priceFromToSlider()
});

function sortByHandler(parentID, param1ID, param2ID) {
	if($("#" + param1ID).is(":visible")) {
		$("#" + param1ID).hide();
		$("#" + param2ID).show()
	} else {
		$("#" + param1ID).show();
		$("#" + param2ID).hide()
	}
	$("#hdnSortElement").text('');
	$("#hdnSortElement").text(parentID);
	filtersHandler()
}

function menuTypeHandler(id) {
	var arrTypes = $("li[id^='liTypeID_']");
	var arrChecked = [];
	var url = "/getShowsByType";
	var urlParams = "";
	$.each(arrTypes, function(index, value) {
		var input = $(value).find("input[type='checkbox']");
		var isChecked = $(input).is(':checked');
		var typeID = $(input).attr("id").split("_")[1];
		$("#subMenuOfType_" + typeID).hide();
		if(isChecked) {
			arrChecked.push(typeID);
			$("#subMenuOfType_" + typeID).show()
		}
	});
	var data = {};
	data.ids = arrChecked.join();
	sendDataToServer(url, data, menuTypeHandlerCallbackSuccess, null)
}

function createShowHTML(arrShows, arrShowsSections) {
	var html = "",
		arrDisplayShows = [],
		arrSelectedTypes = [],
		strSelectedTypes = '';
	$("#ulShows").empty();
	$("#ulShows li").remove();
	strSelectedTypes = $("#hdnSelectedTypes").val();
	arrSelectedTypes = strSelectedTypes.split(',');
	$.each(arrShows, function(index, value) {
		var existsShow = -1;
		$.each(arrDisplayShows, function(i, v) {
			if(v === value.show_id) {
				existsShow = 0
			}
		});
		if(existsShow != -1) {
			return
		}
		arrDisplayShows.push(value.show_id);
		var type = '',
			subtype = '',
			type_id = '',
			subtype_id = '',
			type_color = '',
			subtypeHTML = '',
			imageURL = '',
			showName = '',
			date_f = '',
			date_t = '',
			typeHTML = '',
			existsType = -1;
		$.each(arrSelectedTypes, function(it, vt) {
			if(vt === value.type_id) {
				existsType = 0
			}
		});
		if(existsType == -1) {
			typeHTML = "<a href='#' type_id='" + value.type_id + "' style='background:" + value.type_color + ";' class='top-category-of-event'>" + value.type_name + "</a>"
		} else {
			if(value.subcategory_name != 'undefined' && value.subcategory_name != '' && value.subtype_id != '0') {
				var arrSubTypes = value.subcategory_name.split('|');
				if(arrSubTypes.length > 1) {
					$.each(arrSubTypes, function(is, vs) {
						subtypeHTML += "<a href='#' subtype_id='" + value.subtype_id + "' style='background:" + value.type_color + ";' class='top-category-of-event'>" + vs + "</a>"
					})
				} else {
					subtypeHTML += "<a href='#' subtype_id='" + value.subtype_id + "' style='background:" + value.type_color + ";' class='top-category-of-event'>" + value.subcategory_name + "</a>"
				}
			} else {
				typeHTML = "<a href='#' type_id='" + value.type_id + "' style='background:" + value.type_color + ";' class='top-category-of-event'>" + value.type_name + "</a>"
			}
		}
		var imageName = '';
		if(value.main_image_name != "" && value.main_image_name != undefined) {
			imageName = value.main_image_name
		} else {
			var arrImageName = value.main_image.split('/');
			imageName = arrImageName[arrImageName.length - 1]
		}
		if(value.resource == 'bravo') {
			imageURL = "https://bilety.co.il/images/shows/" + imageName
		} else {
			imageURL = "https://bilety.co.il/images/shows/" + imageName
		}
		if(value.name.length > 50) {
			var n = value.name.substr(0, 50);
			showName = n.substr(0, n.lastIndexOf(" "))
		} else {
			showName = value.name
		}
		date_f = $.datepicker.formatDate("dd.mm.yy", new Date(value.date_from));
		date_t = $.datepicker.formatDate("dd.mm.yy", new Date(value.date_to));
		var date_ft = date_f != date_t ? date_f + " - " + date_t : date_f;
		var date_ft_style = "";
		if(value.no_date == true) {
			date_ft = '';
			date_ft_style = "style='height: 19px;'"
		}
		var show_price = value.price_min != value.price_max ? value.price_min + "&#8362; - " + value.price_max + "&#8362;" : value.price_min + "&#8362;";
		var displayEvent = '';
		if(index == 40) {
			html += "<li id='liShowMore' style='width:100%; text-align:center; padding-bottom:10px;'>" + "<button id='btnShowMore' style='cursor: pointer; text-transform: uppercase; color:black; width: 350px; margin-top: 20px;'>Показать ещё</button>" + "</li>"
		}
		if(index >= 40) {
			displayEvent = "display:none;"
		}
		html += "<li id='liMainShowID_" + value.show_id + "' showCode='" + value.show_code + "' style='" + displayEvent + "' class='col-sm-3 show-main-li'>" + "<div>" + "<div class='text-left'>" + typeHTML + subtypeHTML + "</div>" + "<div class='thumbnail show-main-thumbnail'>" + "<img id='imgShowMain_" + value.show_id + "' src='" + imageURL + "' alt='' class='main-show-image' style='width: 198px; height: 110px;' onerror='handleImageError(this);'>" + "<div class='caption' style='padding:0px;'>" + "<h1 class='main-show-caption'>" + showName + "</h1>" + "<p " + date_ft_style + " >" + date_ft + "</p>" + "<p id='pPrice_" + value.show_id + "'>Цена " + show_price + "</p> <div style='background:" + value.type_color + "'><span style='color:#fff;'>Комментарии(" + value.comments_count + ")</span></div>" + "</div>" + "</div>" + "</div>" + "</li>"
	});
	$("#ulShows").append(html);
	if($("#hdnPriceFrom").val() == '' || $("#hdnPriceTo").val() == '') {
		priceFromToSlider()
	}
}

function menuTypeHandlerCallbackSuccess(data) {
	createShowHTML(data.shows, data.showsSections)
}

function editShowHandler(showID, showCode) {
	var data = {};
	data.id = showID.split("_")[1];
	data.showCode = showCode;
	sendDataToServer('/getShowByID', data, editShowHandlerCallbackSuccess, null)
}

function editShowHandlerCallbackSuccess(data) {
	if(data.show != undefined) {
		$("#divShowEdit").show();
		$("#editShowModal").modal('show');
		fillEditShowHTML(data.show, data.showSeances, data.showMedia, data.comments, data.recommendShows, data.device)
	}
}

function editClose() {
	$('html head').find('title').text("Афиша 2020 - купить билет на концерт, театр онлайн в Израиле - BILETY.CO.IL");
	$("meta[name='description']").attr("content", "Самая большая афиша в Израиле. Куда сходить: расписания концертов, выставок, спектаклей, гастролей, израильских театров, балета, оперы, цирка, клубных событий и развлечений для детей");
	$("#divShowEdit").hide();
	$("#editShowModal").modal('hide');
	$("#iframeSeancePayPage").prop("src", '');
	$("#divSeancePayPage").hide();
	$("#divEditShowBody").show();
	$("#aBackToEdit").hide();
	return !1
}

function backToEdit() {
	$("#iframeSeancePayPage").prop("src", '');
	$("#divSeancePayPage").hide();
	$("#divEditShowBody").show();
	$("#aBackToEdit").hide();
	return !1
}

function showShareLink() {
	if($("#lblShowShareLink").is(":visible")) {
		$("#lblShowShareLink").hide()
	} else {
		$("#lblShowShareLink").show()
	}
	return !1
}

function fillEditShowHTML(show, arrShowsSeances, arrMedia, arrComments, arrRecommendShows, device) {
	var resource = "";
	switch(show[0].resource) {
		case "bravo":
			resource = "https://kaccabravo.co.il";
			break;
		case "biletru":
			resource = "https://biletru.co.il";
			break
	}
	$('html head').find('title').text(show[0].name + " - bilety.co.il");
	$("meta[name='description']").attr("content", show[0].announce);
	$("#spanEditShowName").text(show[0].name);
	$("#lblShowShareLink").hide();
	var params = decodeURIComponent(window.location.search.substring(1));
	$("#lblShowShareLink").text("");
	var port = window.location.port ? ":" + window.location.port : '';
	var serverLink = window.location.protocol + '//' + window.location.hostname + port + "/event/";
	var shareLink = serverLink + show[0].show_code;
	$("#lblShowShareLink").text(shareLink);
	$("#lblShowShareLink").attr("href", shareLink);
	$("#imgEditMain").attr("src", resource + show[0].main_image);
	$("#pEditShowAnnounce").html(show[0].announce);
	var seanceTableHTML = '';
	$.each(arrShowsSeances, function(index, value) {
		var priceMin = '',
			priceMax = '',
			showPrice = '';
		if((value.price_min === '0' && value.price_max === '0') || value.link == "link") {
			return !0
		}
		if(value.price_min == value.price_max || value.price_max == "") {
			showPrice = value.price_min + "&#8362;"
		} else {
			showPrice = value.price_min + " - " + value.price_max + "&#8362;"
		}
		if(value.price_max == "" && value.price_min == "") {
			return
		}
		var date_seance = $.datepicker.formatDate("dd.mm.yy", new Date(value.date));
		var seance_id = "aSeancePay_" + value.id;
		var logo_img = "<img src='/images/" + value.resource + "-logo.jpg' alt='" + value.resource + "' class='partner-logo-" + value.resource + "'/>";
		var targetOpen = "",
			hrefLink = "#",
			seancePayOnClick = "onclick='javascript:showSeancePayPage(this.id)'";
		if(value.resource == "viagogo" || device == "phone" || value.resource == "facebook") {
			targetOpen = "target='_blank'";
			hrefLink = value.link;
			seancePayOnClick = ""
		}
		if(device == "phone") {
			let mobileDateTime = "<li><span>" + date_seance + "&nbsp;" + value.seance_time + "</span></li>";
			if(show[0].no_date == true) {
				mobileDateTime = ""
			}
			seanceTableHTML += "<tr style='background-color: #f5f5f5; border-bottom: solid 10px #fff;'>" + "<td class='text-left table-head-border' style='width:400px;'>" + "<ul class='list-unstyled'>" + "<li><span>" + value.city + "</span></li>" + "<li><span>" + value.hall + "</span></li>" + mobileDateTime + "<td class='text-left'>" + "<ul class='list-unstyled'>" + "<li class='text-center' style='display:none;'><span>" + showPrice + "</span></li>" + "<li class='text-center'>" + "<a id='" + seance_id + "' href='" + hrefLink + "' " + targetOpen + " " + seancePayOnClick + " link='" + value.link + "' style='color: black; cursor: pointer;'>" + logo_img + "</a>" + "</li>" + "</ul>" + "</td>" + "</tr>"
		} else {
			let dateTimeSeance = "<td>" + date_seance + "&nbsp;" + value.seance_time + "</td>";
			$("#thEditSeancesDate").css("display", "block");
			if(show[0].no_date == true) {
				dateTimeSeance = "";
				$("#thEditSeancesDate").css("display", "none")
			}
			seanceTableHTML += "<tr>" + "<td>" + value.city + "</td>" + dateTimeSeance + "<td>" + value.hall + "</td><td style='display:none;'>" + showPrice + "</td><td><a id='" + seance_id + "' href='" + hrefLink + "' " + targetOpen + " " + seancePayOnClick + "  link='" + value.link + "' style='color: black; cursor: pointer;' > " + logo_img + " </a></td></tr>"
		}
	});
	var arrTrs = $("#tableEditSeances tr");
	$.each(arrTrs, function(index, value) {
		if(index > 0) {
			$(this).remove()
		}
		if(index == 0 && device == "phone") {
			$(this).remove()
		}
	});
	$("#tableEditSeances").append(seanceTableHTML);
	var mediaDivHTML = '';
	$.each(arrMedia, function(index, value) {
		if(value.type != 'video') {
			var img = new Image(),
				w, h, maxW = 180,
				maxH = 180,
				ratio = 0,
				width = 0,
				height = 0;
			img.src = value.link;
			img.id = "imgShowMedia_" + value.id;
			img.onload = function() {
				w = this.width;
				h = this.height;
				if(w > maxW) {
					ratio = maxW / w;
					$("#" + this.id).css("width", maxW);
					$("#" + this.id).css("height", h * ratio)
				}
				if(h > maxH) {
					ratio = maxH / h;
					$("#" + this.id).css("height", maxH);
					$("#" + this.id).css("width", w * ratio)
				}
			};
			mediaDivHTML += "<div class='col-xs-6 col-md-3'>" + "<a id='aShowMedia_" + value.id + "' href='' class='thumbnail'>" + "<img id='imgShowMedia_" + value.id + "' src='" + value.link + "' alt='" + show[0].name + "'></img>" + "<a/>" + "</div>"
		}
	});
	$("#divEditGalary").empty();
	$("#divEditGalary").append(mediaDivHTML);
	var commentsDivHTML = '',
		commentsCount = "Комментарии(" + arrComments.length + ")";
	$("#spanCommentsCount").text(commentsCount);
	$("#spanCommentsCount").attr("count", arrComments.length);
	$.each(arrComments, function(index, value) {
		commentsDivHTML += '<li class="comment-li">' + '<div id="divCommentHeader" class="comment-left-mar-bottom5">' + '<img src="images/comment-avatar.jpg" class="comment-avatar"/>' + '<span id="spnCommentName" style="margin-right:5px;">' + value.name + '</span>' + '<span id="spnCommentDate" style="">' + $.datepicker.formatDate("dd.mm.yy", new Date(value.publish_date)) + '</span>' + '</div>' + '<div id="divCommentBody" class="comment-left-mar-bottom5">' + '<span id="spnCommentText" style=""> ' + value.text + ' </span>' + '</div>' + '<div id="divCommentFooter" class="comment-div-footer" style="display:none;">' + '<a id="aCommentReply_' + value.id + '" commentID="' + value.id + '" reply="false" style="cursor: pointer;">Ответить</a>' + '</div>' + '<div id="divCommentReplyForm_' + value.id + '" style="margin-bottom:5px;"></div>' + '</li>'
	});
	$("#ulEditComments li").empty();
	$("#ulEditComments li").remove();
	$("#ulEditComments").append(commentsDivHTML);
	var share = Ya.share2('divSocialShare', {
		content: {
			url: shareLink,
			title: show[0].name,
			image: resource + show[0].main_image,
			description: show[0].announce.split('.')[0]
		}
	});
	var recommendDivHTML = '';
	$.each(arrRecommendShows, function(index, value) {
		var imageName = '';
		if(value.main_image_name != "" && value.main_image_name != undefined) {
			imageName = value.main_image_name
		} else {
			var arrImageName = value.main_image.split('/');
			imageName = arrImageName[arrImageName.length - 1]
		}
		var name = '';
		if(value.name.length > 50) {
			var n = value.name.substr(0, 50);
			var name = n.substr(0, n.lastIndexOf(" "))
		} else {
			var name = value.name
		}
		var linkShow = serverLink + value.show_code;
		recommendDivHTML += '<li style="float: left;">' + '<div class="thumbnail">' + '<a href="' + linkShow + '">' + '<img src="https://bilety.co.il/images/shows/' + imageName + '" alt="' + name + '" title="' + name + '" class="main-show-image" onerror="handleImageError(this);"/>' + '</a>' + '</div>' + '<div class="caption">' + '<a href="' + linkShow + '" class="a-link-general">' + '<h1 class="main-show-caption">' + name + '</h1>' + '</a>' + '</div>' + '</li>'
	});
	$("#ulRecommendShow li").empty();
	$("#ulRecommendShow li").remove();
	$("#ulRecommendShow").append(recommendDivHTML)
}

function searchShowByText(text) {
	console.log("searchShowByText text: ", text);
	if(text.length >= 3 || text.length == 0) {
		filtersHandler()
	} else {
		return
	}
}

function searchShowByTextCallbackSuccess(data) {
	createShowHTML(data.shows, data.showsSections)
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
	var superPrice = $("#inputSuperPrice").is(":checked");
	var discount = $("#inputDiscount").is(":checked");
	var tour = $("#inputTour").is(":checked");
	var minPrice = $("#hdnPriceFrom").val() == '' ? null : parseInt($("#hdnPriceFrom").val());
	var maxPrice = $("#hdnPriceTo").val() == '' ? null : parseInt($("#hdnPriceTo").val());
	var count = 0;
	var arrSelectedTypes = [];
	$.each(arrTypes, function(index, value) {
		var input = $(value).find("input[type='checkbox']");
		var isChecked = $(input).is(':checked');
		var fullID = $(input).attr("id");
		var typeID = $(input).attr("id").split("_")[1];
		$("#subMenuOfType_" + typeID).hide();
		if(isChecked) {
			$("#subMenuOfType_" + typeID).show();
			var subTypesLi = $("#subMenuOfType_" + typeID + " li");
			var subCount = 0;
			arrSelectedTypes.push(typeID);
			$.each(subTypesLi, function(i, v) {
				var inp = $(v).find("input[type='checkbox']");
				var isChk = $(inp).is(':checked');
				var subTypeID = $(inp).attr("id").split("_")[1];
				if(isChk) {
					arrSubTypesChecked.push(subTypeID);
					$("#" + fullID).prop('checked', !1);
					$('label[for=' + fullID + ']').removeClass('checked');
					subCount++
				}
			});
			arrTypesChecked.push({
				type: typeID,
				subTypes: subCount == 0 ? null : arrSubTypesChecked.join()
			});
			count++
		}
	});
	if(count == 0) {
		arrTypesChecked = null
	}
	$("#hdnSelectedTypes").val('');
	$("#hdnSelectedTypes").val(arrSelectedTypes.join(','));
	if($("#hdnSortElement").text() == '') {
		$("#hdnSortElement").text('btnSortByPrice')
	}
	let searchText = '';
	if($(".top-filter-search-div").is(':visible')) {
		searchText = $("#txtSearch").val() == '' ? null : $("#txtSearch").val()
	} else if($(".top-filter-search-small-div").is(':visible')) {
		searchText = $("#txtSearchSmall").val() == '' ? null : $("#txtSearchSmall").val()
	}
	var data = {
		cities: jsonCities == '' ? null : jsonCities,
		types: arrTypesChecked == null ? null : arrTypesChecked,
		subtypes: arrSubTypesChecked == null ? null : arrSubTypesChecked.join(),
		searchText: searchText,
		superPrice: superPrice,
		discount: discount,
		sortByPrice: $("#hdnSortElement").text() == 'btnSortByPrice' ? getSortDirection("btnSortByPrice") : null,
		sortByName: $("#hdnSortElement").text() == 'btnSortByName' ? getSortDirection("btnSortByName") : null,
		sortByDate: $("#hdnSortElement").text() == 'btnSortByDate' ? getSortDirection("btnSortByDate") : null,
		sortBySection: $("#hdnSortElement").text() == 'btnSortBySection' ? getSortDirection("btnSortBySection") : null,
		tour: tour,
		dates: jsonDates == '' ? null : jsonDates,
		minPrice: minPrice,
		maxPrice: maxPrice
	};
	var dd = data;
	sendDataToServer(url, data, menuTypeHandlerCallbackSuccess, null)
}

function getSortDirection(entityID) {
	var elements = $("#" + entityID + " span");
	var sortDirection = "";
	$.each(elements, function(index, value) {
		if($(value).is(":visible") && $(value).hasClass("glyphicon")) {
			sortDirection = $(value).attr("id").split("_")[1]
		}
		if(sortDirection == "") {
			switch(entityID) {
				case "btnSortByPrice":
					sortDirection = "desc";
					break;
				case "btnSortByName":
					sortDirection = "asc";
					break;
				case "btnSortByDate":
					sortDirection = "asc";
					break;
				case "btnSortBySection":
					sortDirection = "asc";
					break
			}
		}
	});
	return sortDirection
}

function clearTopFilter() {
	$("#txtSearch").val('');
	$("#liSuperPrice").removeClass('active');
	$("#liDiscount").removeClass('active');
	$("#liTour").removeClass('active');
	$("#spanSortByPriceAlt_desc").show();
	$("#spanSortByPrice_asc").hide();
	$("#hdnSortElement").text('');
	$("#hdnSortElement").text("btnSortByPrice");
	$("#spanSortByName_asc").show();
	$("#spanSortByNameAlt_desc").hide();
	$("#spanSortBySection_asc").show();
	$("#spanSortBySectionAlt_desc").hide();
	$("#spanSortByDate_asc").show();
	$("#spanSortByDateAlt_desc").hide();
	var arrElements = $("li[id^='liCity_']");
	$.each(arrElements, function(i, v) {
		var input = $(v).find("input[type='checkbox']");
		$(input).prop('checked', !1);
		$('label[for=' + $(input).attr('id') + ']').removeClass('checked')
	});
	filtersHandler()
}

function clearLeftFilter() {
	var arrElements = $("li[id^='liTypeID_']");
	$.each(arrElements, function(i, v) {
		var input = $(v).find("input[type='checkbox']");
		$(input).prop('checked', !1);
		$('label[for=' + $(input).attr('id') + ']').removeClass('checked')
	});
	arrElements = $("li[id^='liSubTypeID_']");
	$.each(arrElements, function(i, v) {
		var input = $(v).find("input[type='checkbox']");
		$(input).prop('checked', !1);
		$('label[for=' + $(input).attr('id') + ']').removeClass('checked')
	});
	arrElements = $("li[id^='liCity_']");
	$.each(arrElements, function(i, v) {
		var input = $(v).find("input[type='checkbox']");
		$(input).prop('checked', !1);
		$('label[for=' + $(input).attr('id') + ']').removeClass('checked')
	});
	arrElements = $("li[id^='liRegion_']");
	$.each(arrElements, function(i, v) {
		var input = $(v).find("input[type='checkbox']");
		$(input).prop('checked', !1);
		$('label[for=' + $(input).attr('id') + ']').removeClass('checked');
		var region = $(v).attr('id').split("_")[1];
		$("#ulCitiesOfRegion_" + region).hide()
	});
	$("#hdnCitiesFilterData").text('');
	arrElements = $("li[id^='liLeftFilter_']");
	$.each(arrElements, function(i, v) {
		var input = $(v).find("input[type='checkbox']");
		$(input).prop('checked', !1);
		$('label[for=' + $(input).attr('id') + ']').removeClass('checked')
	});
	$("#hdnDateFilterData").text('');
	$("#txtDateFrom").val('');
	$("#txtDateTo").val('');
	$("#txtDateFrom").prop('disabled', !1);
	$("#txtDateTo").prop('disabled', !1);
	$("#inputSuperPrice").prop('checked', !1);
	$("label[for='inputSuperPrice']").removeClass('checked');
	$("#inputDiscount").prop('checked', !1);
	$("label[for='inputDiscount']").removeClass('checked');
	$("#inputTour").prop('checked', !1);
	$("label[for='inputTour']").removeClass('checked');
	$("#inputPriceMin").val('');
	$("#inputPriceMax").val('');
	$("#hdnPriceFrom").val('');
	$("#hdnPriceTo").val('');
	filtersHandler()
}

function leftFilterDateHandler(inputDate) {
	var arrFilterDates = $("li[id^='liLeftFilter_']");
	var arrFilterDatesResult = [];
	$("#hdnSortElement").text('btnSortByDate');
	if($("#spanSortByDateAlt_desc").is(":visible")) {
		$("#spanSortByDateAlt_desc").hide();
		$("#spanSortByDate_asc").show()
	}
	$("#txtDateFrom").prop('disabled', !1);
	$("#txtDateTo").prop('disabled', !1);
	if(inputDate) {
		var objDate = new Object();
		var dateFrom = $("#txtDateFrom").datepicker('getDate');
		objDate.fDate = $.datepicker.formatDate("dd.mm.yy", dateFrom);
		var dateTo = $("#txtDateTo").datepicker('getDate');
		objDate.tDate = $.datepicker.formatDate("dd.mm.yy", dateTo);
		arrFilterDatesResult.push(objDate)
	} else {
		$.each(arrFilterDates, function(index, value) {
			var input = $(value).find("input[type='checkbox']");
			var isChecked = $(input).is(':checked');
			var elmID = $(value).attr("id").split("_")[1];
			var tDate = new Date(),
				objDate = new Object();
			if(!isChecked) {
				return
			}
			$("#txtDateFrom").prop('disabled', 'true');
			$("#txtDateTo").prop('disabled', 'true');
			$("#txtDateFrom").val('');
			$("#txtDateTo").val('');
			switch(elmID.toLowerCase()) {
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
					var year = new Date().getFullYear(),
						month = new Date().getMonth(),
						tday = new Date().getDate() + fDate;
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
					break
			}
		})
	}
	$("#hdnDateFilterData").text(JSON.stringify(arrFilterDatesResult));
	filtersHandler(arrFilterDatesResult)
}

function regionsFilterHandler(regionID) {
	var rID = regionID.split("_")[1];
	var arrRegionCities = [],
		liRegionCities = '',
		objRegion = new Object(),
		arrObjRegion = [];
	var arrInputAllRegions = $("input[id^='regionID_']");
	if($("#hdnCitiesFilterData").text() != '') {
		arrObjRegion = JSON.parse($("#hdnCitiesFilterData").text())
	}
	if($("#ulCitiesOfRegion_" + rID).is(":visible")) {
		$("#ulCitiesOfRegion_" + rID).hide();
		var regionToRemove = 0;
		$.each(arrObjRegion, function(i, v) {
			if(v.regionID == rID) {
				regionToRemove = i
			}
		});
		arrObjRegion.splice(regionToRemove, 1)
	} else {
		$("#ulCitiesOfRegion_" + rID).show();
		liRegionCities = $("#ulCitiesOfRegion_" + rID + " li");
		$.each(liRegionCities, function(i, v) {
			var cityID = $(v).prop("id").split("_")[1];
			arrRegionCities.push(cityID)
		});
		objRegion.regionID = rID;
		objRegion.cities = arrRegionCities;
		arrObjRegion.push(objRegion)
	}
	$("#hdnCitiesFilterData").text('');
	$("#hdnCitiesFilterData").text(JSON.stringify(arrObjRegion));
	var c = $("#hdnCitiesFilterData").text();
	filtersHandler()
}

function citiesFilterHandler(cityID) {
	var region = $("#" + cityID).attr("region");
	if($("label[for='regionID_" + region + "']").hasClass('checked')) {
		$("#regionID_" + region).prop('checked', !1);
		$("label[for='regionID_" + region + "']").removeClass('checked')
	}
	var arrObjRegion = JSON.parse($("#hdnCitiesFilterData").text());
	$.each(arrObjRegion, function(i, v) {
		if(v.regionID == region) {
			v.cities = [];
			var arrCitiesInput = $("input[region='" + region + "']");
			$.each(arrCitiesInput, function(ic, vc) {
				if($(vc).is(":checked")) {
					v.cities.push($(vc).attr("id").split("_")[1])
				}
			});
			if(v.cities.length == 0) {
				$("#ulCitiesOfRegion_" + region).hide()
			}
		}
	});
	$("#hdnCitiesFilterData").text('');
	$("#hdnCitiesFilterData").text(JSON.stringify(arrObjRegion));
	var d = $("#hdnCitiesFilterData").text();
	filtersHandler()
}

function leftFilterPriceHandler() {
	var minPrice = $("#inputPriceMin").val() == '' ? 0 : parseInt($("#inputPriceMin").val());
	var maxPrice = parseInt($("#inputPriceMax").val());
	if(minPrice > maxPrice && maxPrice != 0) {
		return
	} else {
		filtersHandler()
	}
}

function validateData(dateText) {
	var vDay = new Date().getDate(),
		vMonth = new Date().getMonth(),
		vYear = new Date().getFullYear(),
		result = !0;
	if(dateText.length != 10) {
		result = !1
	}
	var arrDateParts = dateText.split("/");
	if(arrDateParts.length != 3) {
		return !1
	}
	if(arrDateParts[0].length != 2) {
		return !1
	}
	var day = parseInt(arrDateParts[0]);
	if(day > 31 || day < 1 || (day < vDay && arrDateParts[1] == vMonth)) {
		return !1
	}
	if(arrDateParts[1].length != 2) {
		return !1
	}
	var month = parseInt(arrDateParts[1]);
	if(month > 12 || month < 1 || (month < vMonth && arrDateParts[2] == vYear)) {
		return !1
	}
	if(arrDateParts[2].length > 4) {
		return !1
	}
	var year = parseInt(arrDateParts[2]);
	if(year < vYear) {
		return !1
	}
	return result
}

function showSeancePayPage(id) {
	var payLink = $("#" + id).attr("link");
	$("#iframeSeancePayPage").prop("src", payLink);
	$("#divSeancePayPage").show();
	$("#divEditShowBody").hide();
	$("#aBackToEdit").show();
	$("#divLoadingEdit").addClass("wait-modal").removeClass("wait-modal-none");
	$("#iframeSeancePayPage").on('load', function() {
		$("#divLoadingEdit").removeClass("wait-modal").addClass("wait-modal-none")
		$("#divModalEdit").removeClass("wait-modal").addClass("wait-modal-none")
	});
	return !1
}

function imageSizeHandler() {
	arrImg = $("#divEditGalary img");
	$.each(arrImg, function(i, v) {
		var width = $(this).width();
		var height = $(this).height()
	})
}

function directLink() {
	var params = decodeURIComponent(window.location.search.substring(1));
	var agent = navigator.userAgent,
		typeID = '',
		subTypeID = '';
	var arrURL = window.location.href.split("/");
	loadTypeNameValueDictionary();
	loadSubTypeNameValueDictionary();
	try {
		if(params.split("=")[0] == "show") {
			var showCode = params.split('=')[1].split('&')[0];
			if(params.split("=")[1].split("&")[1] == "comment") {
				$("#hdnMoveToText").val(params.split("=")[2])
			}
			editShowHandler('', showCode)
		} else if(arrURL.length > 3 && arrURL[3] != "") {
			var lastIndex = arrURL.length == 4 ? 1 : 2;
			switch(arrURL[arrURL.length - lastIndex]) {
				case "":
					break
			}
			typeID = typeNameValueDictionary[arrURL[arrURL.length - lastIndex]];
			if(arrURL.length > 4) {
				subTypeID = subTypeNameValueDictionary[arrURL[arrURL.length - 1]];
				var fullSubTypeID = "subTypeID_" + subTypeID;
				$("#" + fullSubTypeID).prop('checked', !0);
				$('label[for=' + fullSubTypeID + ']').addClass('checked')
			}
			var fullID = "typeID_" + typeID;
			$("#" + fullID).prop('checked', !0);
			$('label[for=' + fullID + ']').addClass('checked');
			filtersHandler()
		}
	} catch(error) {
		console.log("directLink error: ", error)
	}
}

function setCommentFocus() {
	if($("#hdnMoveToText").val() != '') {
		var modH = $("div.modal-dialog").height();
		var comHo = $("#panelComments").outerHeight();
		if(modH == 0) {
			setTimeout(setCommentFocus, 500)
		} else {
			var scroll = (parseInt(modH) - parseInt(comHo)) - 200;
			$('#editShowModal').animate({
				scrollTop: scroll
			}, 2000);
			$("#hdnMoveToText").val('')
		}
	}
}

function handleImageError(obj) {
	$(obj).attr('src', '/images/default-image.jpg')
}

function sendComment(typeComment, parentID) {
	var name = $("#txtCommentName").val(),
		email = $("#txtCommentEmail").val(),
		text = $("#txtCommentText").val();
	if(!isValidEmail(email)) {
		alert("Email address not valid.");
		return
	}
	if($.trim(name).length == 0 || $.trim(text).length == 0) {
		alert("Please fill name and text fields");
		return
	}
	var data = {
		name: name,
		email: email,
		text: text,
		host: typeComment,
		parentID: parentID,
		showCode: $("#hdnEditShowID").val()
	};
	sendDataToServer("/createComment", data, sendCommentCallbackSuccess, sendCommentCallbackError)
}

function sendCommentCallbackSuccess() {
	$("#txtCommentName").val('');
	$("#txtCommentEmail").val('');
	$("#txtCommentText").val('');
	$("#divEditCommentFormAlertSuccess").show();
	$("#divEditCommentFormAlertSuccess").delay(5000).fadeOut(400);
	var htmlComments = $("#divEditComments").html()
}

function sendCommentCallbackError(error) {
	$("#divEditCommentFormAlertError").show();
	$("#divEditCommentFormAlertError").delay(5000).fadeOut(400)
}

function isValidEmail(email) {
	var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
	return pattern.test(email)
}

function loadCommentForm(commentID) {
	closeReplyForms();
	$("#aCommentReply_" + commentID).text('Закрыть');
	$("#aCommentReply_" + commentID).attr("reply", "true");
	var html = '<div id="divCommentReplyForm">' + '<div id="divCommentFormReplyAlertSuccess" style="display:none;" class="alert alert-success">' + '<a href="#" data-dismiss="alert" aria-label="close" class="close">&times;</a>' + '<span>Комментарий успешно отправлен на проверку администратору проекта.</span>' + '</div>' + '<div id="divCommentFormReplyAlertError" style="display:none;" class="alert alert-danger">' + '<a href="#" data-dismiss="alert" aria-label="close" class="close">&times;</a>' + '<span>Произошла ошибка при сохранение комментария.</span>' + '</div>' + '<ul style="width: 500px; margin:auto;" class="row list-unstyled">' + '<li style="margin-bottom:5px;">' + '<input id="txtCommentName" type="text" placeholder="Имя" required="" class="form-control"/>' + '</li>' + '<li style="margin-bottom:5px;">' + '<input id="txtCommentEmail" type="email" name="email" placeholder="Email" required="" class="form-control"/>' + '</li>' + '<li style="margin-bottom:5px;">' + '<textarea id="txtCommentText" type="text" cols="40" rows="5" placeholder="" required="" class="form-control"></textarea>' + '</li>' + '<li style="margin-bottom:5px;">' + '<button id="btnReplyComment_' + commentID + '" parentID="' + commentID + '" type="button" style="text-transform: uppercase; float: left;" class="btn btn-default">отправить</button>' + '</li>' + '</ul>' + '</div>';
	$("#divCommentReplyForm_" + commentID).html('');
	$("#divCommentReplyForm_" + commentID).append(html)
}

function closeReplyForms() {
	var arrReplyForm = $("div[id^='divCommentReplyForm_']");
	$.each(arrReplyForm, function(index, value) {
		$(this).html('');
		var id = value.id.split("_")[1];
		$("a#aCommentReply_" + id).attr("reply", "false");
		$("a#aCommentReply_" + id).text("Ответить")
	})
}

function loadTypeNameValueDictionary() {
	typeNameValueDictionary.concert = '1';
	typeNameValueDictionary.theater = '2';
	typeNameValueDictionary.circus = '3';
	typeNameValueDictionary.humor = '4';
	typeNameValueDictionary.children = '5';
	typeNameValueDictionary.show = '6';
	typeNameValueDictionary.meetings = '7';
	typeNameValueDictionary.sport = '8';
	typeNameValueDictionary.cinema = '9';
	typeNameValueDictionary.exibitions = '10';
	typeNameValueDictionary.excursions = '11'
}

function loadSubTypeNameValueDictionary() {
	subTypeNameValueDictionary.poprock = '1';
	subTypeNameValueDictionary.stage = '2';
	subTypeNameValueDictionary.hiphop = '3';
	subTypeNameValueDictionary.jazzblues = '4';
	subTypeNameValueDictionary.classic = '5';
	subTypeNameValueDictionary.bard = '6';
	subTypeNameValueDictionary.folk = '7';
	subTypeNameValueDictionary.performances = '8';
	subTypeNameValueDictionary.musical = '9';
	subTypeNameValueDictionary.opera = '10';
	subTypeNameValueDictionary.ballet = '11';
	subTypeNameValueDictionary.comedy = '12';
	subTypeNameValueDictionary.drama = '13';
	subTypeNameValueDictionary.detective = '14'
}

function focusComments(e) {
	e.preventDefault();
	var scr = $('#editShowModal').prop("scrollHeight");
	$("#editShowModal").animate({
		scrollTop: scr
	}, 1000)
}

function displayMobileSearch() {
	var visible = $("#divTopFilter").is(":visible");
	if(visible) {
		$("#divTopFilter").css("display", "none")
	} else {
		$("#divTopFilter").css("display", "block")
	}
	return !1
}

function displayMobileLeftFilter() {
	var visible = $("#divLeftFilter").is(":visible");
	if(visible) {
		$("#divLeftFilter").css("display", "none");
		$(".div-left-filter-contaner").addClass("div-left-filter-left-10");
		$(".div-left-filter-contaner").removeClass("div-left-filter-left-500");
		$("#divModal").removeClass("wait-modal");
		$("#divModal").addClass("wait-modal-none");
		$("body").removeClass("overflow-hidden")
	} else {
		$("#divLeftFilter").css("display", "block");
		$(".div-left-filter-contaner").addClass("div-left-filter-left-500");
		$(".div-left-filter-contaner").removeClass("div-left-filter-left-10");
		$("#divModal").addClass("wait-modal");
		$("#divModal").removeClass("wait-modal-none");
		$("body").addClass("overflow-hidden")
	}
	$("#divLeftFilter").css("z-index", "2000");
	$("#divLeftFilter").css("background-color", "#fff");
	return !1
}

function mobileHideFilterButtons() {
	var params = decodeURIComponent(window.location.search.substring(1));
	var arrURL = window.location.href.split("/");
	console.log("params: ", params);
	console.log("split url: ", arrURL);
	var pageName = arrURL[3].replace("#", "");
	if(pageName === "posts" || pageName === "post_edit" || pageName === "about") {
		$("#menuTopFilter").css("display", "none");
		$(".div-left-filter-contaner").css("display", "none")
	}
}

function priceFromToSlider() {
	var liLast, id, idLast, maxPrice, minPrice, maxPr, minPr;
	var sortPrice = $("#hdnSortElement").text() == 'btnSortByPrice' ? getSortDirection("btnSortByPrice") : null;
	var liFirst = $("#ulShows > li")[0];
	if(liFirst != undefined) {
		liLast = $("#ulShows > li")[$("#ulShows > li").length - 1];
		id = "pPrice_" + $(liFirst).prop("id").split("_")[1];
		idLast = "pPrice_" + $(liLast).prop("id").split("_")[1];
		maxPrice = $("#" + id).text().split(" ")[1].replace(String.fromCharCode(8362), '');
		minPrice = $("#" + idLast).text().split(" ")[1].replace(String.fromCharCode(8362), '');
		maxPr = sortPrice === 'asc' ? parseInt(minPrice) : parseInt(maxPrice);
		minPr = sortPrice === 'asc' ? parseInt(maxPrice) : parseInt(minPrice)
	} else {
		minPr = 0;
		maxPr = 1
	}
	$("#slider-range").slider({
		range: !0,
		min: minPr,
		max: maxPr,
		step: 5,
		values: [minPr, maxPr],
		slide: function(event, ui) {
			$("#amount").val(ui.values[0] + String.fromCharCode(8362) + " - " + ui.values[1] + String.fromCharCode(8362));
			$("#hdnPriceFrom").val(ui.values[0]);
			$("#hdnPriceTo").val(ui.values[1]);
			filtersHandler()
		}
	});
	var prmin = $("#slider-range").slider("values", 0);
	var prmax = $("#slider-range").slider("values", 1);
	$("#amount").val(prmin + String.fromCharCode(8362) + " - " + prmax + String.fromCharCode(8362))
}

function addNewsletterSubscription() {
	if(!isValidEmail($("#inpSubscriptionEmail").val())) {
		$("#inpSubscriptionEmail").addClass("input-text-error");
		$("#inpSubscriptionEmail").focus();
		$("#inpSubscriptionEmail").focusout(function() {
			$(this).removeClass("input-text-error")
		})
	} else {
		var data = {
			email: $("#inpSubscriptionEmail").val()
		};
		sendDataToServer('/addSubscription', data, newsletterSubscriptionMessage, null)
	}
}

function removeNewsletterSubscription() {
	var data = {
		email: $("#inpSubscriptionEmail").val()
	};
	sendDataToServer('/removeSubscription', data, newsletterSubscriptionMessage, null)
}

function newsletterSubscriptionMessage(result) {
	console.log("success subscribe");
	console.log("success subscribe result: ", result);
	$("#spanSubscriberAlertSuccess").text(result.message);
	$("#divAlertSubscriberSuccess").show();
	$("#pPanelSubscriberText").hide();
	$("#divAlertSubscriberSuccess").delay(2000).fadeOut(400);
	$("#pPanelSubscriberText").delay(2400).fadeIn(400)
}

function sendDataToServer(path, data, callbackSuccess, callbackError) {
	try {
		$.ajax({
			url: path,
			contentType: 'application/json',
			type: 'POST',
			data: JSON.stringify(data),
			success: function(response) {
				if(callbackSuccess != null || callbackSuccess != '') {
					callbackSuccess(response)
				}
			},
			error: function(error) {
				if(callbackError != null && callbackError != '') {
					callbackError(error)
				}
			}
		})
	} catch(error) {
		console.error("sendDataToServer error: ", error)
	}
}
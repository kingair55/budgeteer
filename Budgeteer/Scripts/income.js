var suggestionListIncome = Object.create(null);
var listCreatedIncome = false;
var labelToUpdateIncome = "";
var newlyCreatedLabelIncome;
var lastHoveredListItemTextIncome = "";
var timeoutIncome;

$("#addIncome").click(function () {
    var linebreak = document.createElement("br");
    var newDiv = document.createElement("div");
    var newLabel = document.createElement("label");
    var newInput = document.createElement("input");
    var elementCount = parseInt(getElementCountByClass(".incomeType")) + parseInt("1");
    newDiv.id = "incomeDiv" + elementCount;
    newDiv.className = "incomeEntry";
    newLabel.id = "incomeLabel" + elementCount;
    newLabel.className = "incomeType";
    newLabel.innerText = "Click to edit";
    newInput.id = "incomeField" + elementCount;
    newInput.className = "incomeInput";
    newInput.type = "text";
    newInput.value = "Income";

    document.getElementById("incomeList").appendChild(newDiv);
    document.getElementById(newDiv.id).appendChild(newLabel);
    document.getElementById(newDiv.id).appendChild(newInput);

    $("#" + newDiv.id).css("background-color", "#cee7fa");

    var temp = newInput.id;
    var elem = $("#"+temp);
    elem.data("oldValue", elem.val());
    elem.on("propertychange change click keyup input paste", function (event) {
        if (elem.data("oldValue") != elem.val()) {
            var total = parseInt($("#totalIncomeValue").text().replace(/[^0-9]/g, "")) || 0;
            total = (total - (parseInt(elem.data("oldValue")) || 0)) + (parseInt(elem.val()) || 0);
            elem.data("oldValue", elem.val());
            $("#totalIncomeValue").text("$" + total);
        }
    });

    elem.on("click", function () {
        $(this).focus().select();
    });
    
    elem.on("blur", function () {
        updateSavingsTextColor();
    });

    timeoutIncome = setTimeout(function () {
        $("#" + newDiv.id).css("background-color", "white");
    }, 5000);

    $(".incomeEntry").on("mouseover", function () {
        $("#editEntryModal").appendTo(this);
        $("#editEntryModal").css("display", "block");
        $("#editEntryModal").css("float", "right");

        $("#deleteEntry").appendTo($("#editEntryModal"));
        $("#deleteEntry").css("display", "block");
    });

    $(".incomeEntry").on("mouseout", function () {
        $("#editEntryModal").css("display", "none");
        $("#deleteEntry").css("display", "none");
    });

    AddEntry();
});

function AddEntry() {
    var url = "/Home/AddEntry";
    $.post(url, { type: "", name: "", value: 0, month: 0,  year: 0});
}

$(document).on("click", "label.incomeType", function () {
    var txt = $(this).text();
    labelToUpdateIncome = $(this).attr("id");
    $(this).replaceWith("<input class=\"tempClassEntryIncomeLabel\" />");
    setCssOnTempEntryIncomeLabel();
    jsInjectionIncome();
    $("input.tempClassEntryIncomeLabel").val(txt);
    $("input.tempClassEntryIncomeLabel").focus().select();
});

$(document).on("blur", "input.tempClassEntryIncomeLabel", function () {
    $("#listSuggestionIncome").remove();
    listCreatedIncome = false;
    var txt = $(this).val();
    var elementCount = getElementCountByClass(".incomeType");
    $(this).replaceWith("<label " + "id=\"" + labelToUpdateIncome +  "\" " + "class=\"tempClassEntryIncomeLabel\"></label>");

    var newLabel = $("label.tempClassEntryIncomeLabel");

    if (txt != "") {
        if (lastHoveredListItemTextIncome == "")
            newLabel.text(txt);
        else
            newLabel.text(lastHoveredListItemTextIncome);
    }
    else
        newLabel.text("Click to edit");

    if (newLabel.text() != "Click to edit" && !(newLabel.text() in suggestionListIncome)) {
        suggestionListIncome[newLabel.text()] = "";
    }

    newLabel.removeClass("tempClassEntryIncomeLabel").addClass("incomeType");

    labelToUpdateIncome = "";
    newlyCreatedLabelIncome = newLabel;
    lastHoveredListItemTextIncome = "";
});

$(".incomeInput").each(function () {
    var elem = $(this);
    elem.data("oldValue", elem.val());

    elem.on("propertychange change click keyup input paste", function (event) {
        if (elem.data("oldValue") != elem.val()) {
            var total = parseInt($("#totalIncomeValue").text().replace(/[^0-9]/g, "")) || 0;
            total = (total - (parseInt(elem.data("oldValue")) || 0)) + (parseInt(elem.val()) || 0);
            elem.data("oldValue", elem.val());
            $("#totalIncomeValue").text("$" + total);
        }
    });
});

function jsInjectionIncome() {
    $("input.tempClassEntryIncomeLabel").on("keyup", function () {
        var theField = $(this);
        if (theField.val().length > 2 && hasProperty(suggestionListIncome)) {
            if (!listCreatedIncome) {
                theField.after("<ul id=\"listSuggestionIncome\"></ul>");
                listCreatedIncome = true;
            }
            var theList = $("#listSuggestionIncome");
            theList.empty();

            for (var key in suggestionListIncome) {
                if (key.toLowerCase().indexOf(theField.val()) > -1) {
                    theList.append("<li class=\"wordsIncome\">" + key + "</li>");
                }
            }

            if (theList.children("li").length == 0) {
                theList.remove();
                listCreatedIncome = false;
            }
            else {
                $(document).on("mouseover", ".wordsIncome", function () {
                    lastHoveredListItemTextIncome = this.innerText;
                });
                $(document).on("mouseout", ".wordsIncome", function () {
                    lastHoveredListItemTextIncome = "";
                });
            }
        } else {
            $("#listSuggestionIncome").remove();
            listCreatedIncome = false;
        }
    });
}

$(".incomeInput").on("click", function () {
    $(this).focus().select();
});

$(".incomeInput").on("blur", function () {
    updateSavingsTextColor();
});

$(".incomeEntry").on("mouseover", function () {
    var modal = $("#editEntryModal");
    modal.appendTo(this);
    modal.css("display", "block");
    modal.css("float", "right");

    var deleteEntry = $("#deleteEntry");
    deleteEntry.appendTo(modal);
    SetCssOnMouseover(deleteEntry);
});

$(".incomeEntry").on("mouseout", function () {
    $("#editEntryModal").css("display", "none");
    $("#deleteEntry").css("display", "none");
});

function setCssOnTempEntryIncomeLabel() {
    $(".tempClassEntryIncomeLabel").css("width", "186px");
    $(".tempClassEntryIncomeLabel").css("height", "26px");
    $(".tempClassEntryIncomeLabel").css("display", "block");
    $(".tempClassEntryIncomeLabel").css("margin-top", "12px");
    $(".tempClassEntryIncomeLabel").css("margin-right", "10px");
    $(".tempClassEntryIncomeLabel").css("float", "left");
    $(".tempClassEntryIncomeLabel").css("font-size", "18px");
    $(".tempClassEntryIncomeLabel").css("font-family", "Segoe UI");
}
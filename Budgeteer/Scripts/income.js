var suggestionListIncome = Object.create(null);
var listCreatedIncome = false;
var labelToUpdateIncome = "";
var newlyCreatedLabelIncome;
var lastHoveredListItemTextIncome = "";

$("#addIncome").click(function () {
    var linebreak = document.createElement("br");
    var newLabel = document.createElement("label");
    var newInput = document.createElement("input");
    var elementCount = getElementCountByClass(".incomeType");
    newLabel.id = "incomeLabel" + (parseInt(elementCount) + parseInt("1"));
    newLabel.className = "incomeType";
    newLabel.innerText = "Click to edit";
    newInput.id = "incomeField" + (parseInt(elementCount) + parseInt("1"));
    newInput.className = "incomeInput";
    newInput.type = "text";
    newInput.value = "Income";

    document.getElementById("incomeList").appendChild(linebreak);
    document.getElementById("incomeList").appendChild(newLabel);
    document.getElementById("incomeList").appendChild(newInput);

    var temp = newInput.id;
    var elem = $("#"+temp);
    elem.data("oldValue", elem.val());
    elem.on("propertychange change click keyup input paste", function (event) {
        if (elem.data("oldValue") != elem.val()) {
            var total = parseInt($("#totalIncomeValue").text().replace(/[^0-9]/g, "")) || 0;
            total = (total - (parseInt(elem.data("oldValue")) || 0)) + (parseInt(elem.val()) || 0);
            elem.data("oldValue", elem.val());
            $("#totalIncomeValue").text(total);
        }
    });

    elem.on("click", function () {
        $(this).focus().select();
    });
});

$(document).on("click", "label.incomeType", function () {
    var txt = $(this).text();
    labelToUpdateIncome = $(this).attr("id");
    $(this).replaceWith("<input class=\"tempClassIncome\" />");
    jsInjectionIncome();
    $("input.tempClassIncome").val(txt);
    $("input.tempClassIncome").focus().select();
});

$(document).on("blur", "input.tempClassIncome", function () {
    $("#listSuggestionIncome").remove();
    listCreatedIncome = false;
    var txt = $(this).val();
    var elementCount = getElementCountByClass(".incomeType");
    $(this).replaceWith("<label " + "id=\"" + labelToUpdateIncome +  "\" " + "class=\"tempClassIncome\"></label>");

    var newLabel = $("label.tempClassIncome");

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
    newLabel.removeClass("tempClassIncome").addClass("incomeType");
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
            $("#totalIncomeValue").text(total);
        }
    });
});

function jsInjectionIncome() {
    $("input.tempClassIncome").on("keyup", function () {
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

function getElementCountByClass(elementClass){
    return count = $(elementClass).length;
}

function hasProperty(object) {
    for (var prop in object) {
        return true;
    }
    return false;
}
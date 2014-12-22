var suggestionListExpense = [];
var listCreatedExpense = false;
var labelToUpdateExpense = "";

$("#addExpense").click(function () {
    var linebreak = document.createElement("br");
    var newLabel = document.createElement("label");
    var newInput = document.createElement("input");
    var elementCount = getElementCountByClass(".expenseType");
    newLabel.id = "expenseLabel" + (parseInt(elementCount) + parseInt("1"));
    newLabel.className = "expenseType";
    newLabel.innerText = "Click to edit";
    newInput.id = "expenseField" + (parseInt(elementCount) + parseInt("1"));
    newInput.className = "expenseInput";
    newInput.type = "text";
    newInput.value = "Expense";

    document.getElementById("expenseList").appendChild(linebreak);
    document.getElementById("expenseList").appendChild(newLabel);
    document.getElementById("expenseList").appendChild(newInput);

    var temp = newInput.id;
    var elem = $("#"+temp);
    elem.data("oldValue", elem.val());
    elem.on("propertychange change click keyup input paste", function (event) {
        if (elem.data("oldValue") != elem.val()) {
            var total = parseInt($("#totalExpenseValue").text().replace("/[^0-9]/g", "")) || 0;
            total = (total - (parseInt(elem.data("oldValue")) || 0)) + (parseInt(elem.val()) || 0);
            elem.data("oldValue", elem.val());
            $("#totalExpenseValue").text(total);
        }
    });
});

$(document).on("click", "label.expenseType", function () {
    var txt = $(this).text();
    labelToUpdateExpense = $(this).attr("id");
    $(this).replaceWith("<input class=\"tempClassExpense\" />");
    jsInjectionExpense();
    $("input.tempClassExpense").val(txt);
    $("input.tempClassExpense").focus().select();
});

$(document).on("blur", "input.tempClassExpense", function () {
    $("#listSuggestionExpense").remove();
    listCreatedExpense = false;
    var txt = $(this).val();
    var elementCount = getElementCountByClass(".expenseType");
    $(this).replaceWith("<label " + "id=\"" + labelToUpdateExpense + "\" " + "class=\"tempClassExpense\"></label>");

    if(txt != "")
        $("label.tempClassExpense").text(txt);
    else
        $("label.tempClassExpense").text("Click to edit");

    if ($("label.tempClassExpense").text() != "Click to edit") {
        suggestionListExpense[suggestionListExpense.length] = $("label.tempClassExpense").text();
    }
    $("label.tempClassExpense").removeClass("tempClassExpense").addClass("expenseType");
    labelToUpdateExpense = "";
});

$(".expenseInput").each(function () {
    var elem = $(this);
    elem.data("oldValue", elem.val());
    elem.on("propertychange change click keyup input paste", function (event) {
        if (elem.data("oldValue") != elem.val()) {
            var total = parseInt($("#totalExpenseValue").text().replace("/[^0-9]/g", "")) || 0;
            total = (total - (parseInt(elem.data("oldValue")) || 0)) + (parseInt(elem.val()) || 0);
            $("#totalExpenseValue").text(total);
            elem.data("oldValue", elem.val());
        }
    });
});


function jsInjectionExpense() {
    $("input.tempClassExpense").on("keyup", function () {
        var theField = $(this);
        if (theField.val().length > 2 && suggestionListExpense.length > 0) {
            if (!listCreatedExpense) {
                theField.after("<ul id=\"listSuggestionExpense\"></ul>");
                listCreatedExpense = true;
            }
            var theList = $("#listSuggestionExpense");
            theList.empty();

            for (i = 0; i < suggestionListExpense.length; i++) {
                var word = suggestionListExpense[i];
                if (word.toLowerCase().indexOf(theField.val()) > -1) {
                    theList.append("<li class=\"wordsExpense\">" + word + "</li>");
                }
            }

            if (theList.children("li").length == 0) {
                theList.remove();
                listCreatedExpense = false;
            }
        } else {
            $("#listSuggestionExpense").remove();
            listCreatedExpense = false;
        }
    });
}

function getElementCountByClass(elementClass) {
    return count = $(elementClass).length;
}

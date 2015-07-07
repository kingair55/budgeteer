var suggestionListExpense = Object.create(null);
var listCreatedExpense = false;
var labelToUpdateExpense = "";
var newlyCreatedLabelExpense;
var lastHoveredListItemTextExpense = "";
var timeoutExpense;
var monthMap = { 'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 8, 'October': 10, 'November': 11, 'December': 12 };

$("#addExpense").click(function () {
    var linebreak = document.createElement("br");
    var newDiv = document.createElement("div");
    var newLabel = document.createElement("label");
    var newInput = document.createElement("input");
    var elementCount = (parseInt(getElementCountByClass(".expenseType")) + parseInt("1"));
    newDiv.id = "expenseDiv" + elementCount;
    newDiv.className = "expenseEntry";
    newLabel.id = "expenseLabel" + elementCount;
    newLabel.className = "expenseType";
    newLabel.innerText = "Click to edit";
    newInput.id = "expenseField" + elementCount;
    newInput.className = "expenseInput";
    newInput.type = "text";
    newInput.value = "Expense";

    document.getElementById("expenseList").appendChild(newDiv);
    document.getElementById(newDiv.id).appendChild(newLabel);
    document.getElementById(newDiv.id).appendChild(newInput);

    $("#" + newDiv.id).css("background-color", "#cee7fa");

    var temp = newInput.id;
    var elem = $("#"+temp);
    elem.data("oldValue", elem.val());
    elem.on("propertychange change click keyup input paste", function (event) {
        if (elem.data("oldValue") != elem.val()) {
            var total = parseInt($("#totalExpenseValue").text().replace(/[^0-9]/g, "")) || 0;
            total = (total - (parseInt(elem.data("oldValue")) || 0)) + (parseInt(elem.val()) || 0);
            elem.data("oldValue", elem.val());
            $("#totalExpenseValue").text("$" + total);
        }
    });

    elem.on("click", function () {
        $(this).focus().select();
    });

    elem.on("blur", function () {
        updateSavingsTextColor();
        updateExpenseEntry(this);
    });

    timeoutExpense = setTimeout(function () {
        $("#"+newDiv.id).css("background-color", "white");
    }, 5000);

    $(".expenseEntry").on("mouseover", function () {
        $("#editEntryModal").appendTo(this);
        $("#editEntryModal").css("display", "block");
        $("#editEntryModal").css("float", "right");

        $("#deleteEntry").appendTo($("#editEntryModal"));
        $("#deleteEntry").css("display", "block");
    });

    $(".expenseEntry").on("mouseout", function () {
        $("#editEntryModal").css("display", "none");
        $("#deleteEntry").css("display", "none");
    });

    AddExpenseEntry(elementCount);
});

function AddExpenseEntry(entryPosition) {
    var url = "/Home/AddEntry";
    var username = $("#username").text();
    var usernameLength = username.length;
    var entryYear = $("#lblYear").text();
    var entryMonth = $("#lblMonth").text();

    $.post(url, { type: 2, year: parseInt(entryYear), month: monthMap[entryMonth], position: entryPosition, name: "", value: 0, username: username.substring(6, usernameLength - 1) }, function (result) { alert(result); }, "json"); //2 = Expense based from EntryType enum
}

function updateExpenseEntry(elem) {
    var url = "/Home/UpdateEntry";
    var entryPosition = 0;
    var name = "";
    var value = 0;
    var username = $("#username").text();
    var usernameLength = username.length;
    var entryId = $(elem).attr("id");
    entryPosition = parseInt(entryId.slice(-1));

    name = $("#" + "expenseLabel" + entryPosition).text();
    value = parseInt($("#" + "expenseField" + entryPosition).val()) || -1;

    if (name != "Click to edit" && value > 0)
        $.post(url, { type: 2, position: entryPosition, name: name, value: value, username: username.substring(6, usernameLength - 1) }, function (result) { alert(result); }, "json");
}

$(document).on("click", "label.expenseType", function () {
    var txt = $(this).text();
    labelToUpdateExpense = $(this).attr("id");
    $(this).replaceWith("<input class=\"tempClassEntryExpenseLabel\" />");
    setCssOnTempEntryExpenseLabel();
    jsInjectionExpense();
    $("input.tempClassEntryExpenseLabel").val(txt);
    $("input.tempClassEntryExpenseLabel").focus().select();
});

$(document).on("blur", "input.tempClassEntryExpenseLabel", function () {
    $("#listSuggestionExpense").remove();
    listCreatedExpense = false;
    var txt = $(this).val();
    var elementCount = getElementCountByClass(".expenseType");
    $(this).replaceWith("<label " + "id=\"" + labelToUpdateExpense + "\" " + "class=\"tempClassEntryExpenseLabel\"></label>");

    var newLabel = $("label.tempClassEntryExpenseLabel");

    if (txt != "") {
        if (lastHoveredListItemTextExpense == "")
            newLabel.text(txt);
        else
            newLabel.text(lastHoveredListItemTextExpense);
    }
    else
        newLabel.text("Click to edit");

    if (newLabel.text() != "Click to edit" && !(newLabel.text() in suggestionListExpense)) {
        suggestionListExpense[newLabel.text()] = newLabel.text();
    }

    newLabel.removeClass("tempClassEntryExpenseLabel").addClass("expenseType");

    labelToUpdateExpense = "";
    newlyCreatedLabelExpense = newLabel;
    lastHoveredListItemTextExpense = "";

    updateExpenseEntry(newLabel);
});

$(".expenseInput").each(function () {
    var elem = $(this);
    elem.data("oldValue", elem.val());

    elem.on("propertychange change click keyup input paste", function (event) {
        if (elem.data("oldValue") != elem.val()) {
            var total = parseInt($("#totalExpenseValue").text().replace(/[^0-9]/g, "")) || 0;
            total = (total - (parseInt(elem.data("oldValue")) || 0)) + (parseInt(elem.val()) || 0);
            elem.data("oldValue", elem.val());
            $("#totalExpenseValue").text("$" + total);
        }
    });
});

function jsInjectionExpense() {
    $("input.tempClassEntryExpenseLabel").on("keyup", function () {
        var theField = $(this);
        if (theField.val().length > 2 && hasProperty(suggestionListExpense)) {
            if (!listCreatedExpense) {
                theField.after("<ul id=\"listSuggestionExpense\"></ul>");
                listCreatedExpense = true;
            }
            var theList = $("#listSuggestionExpense");
            theList.empty();

            for (var key in suggestionListExpense) {
                if (key.toLowerCase().indexOf(theField.val()) > -1) {
                    theList.append("<li class=\"wordsExpense\">" + key + "</li>");
                }
            }

            if (theList.children("li").length == 0) {
                theList.remove();
                listCreatedExpense = false;
            }
            else {
                $(document).on("mouseover", ".wordsExpense", function () {
                    lastHoveredListItemTextExpense = this.innerText;
                });
                $(document).on("mouseout", ".wordsExpense", function () {
                    lastHoveredListItemTextExpense = "";
                });
            }
        } else {
            $("#listSuggestionExpense").remove();
            listCreatedExpense = false;
        }
    });
}

$(".expenseInput").on("click", function () {
    $(this).focus().select();
});

$(".expenseInput").on("blur", function () {
    updateSavingsTextColor();
    updateExpenseEntry(this);
});

$(".expenseEntry").on("mouseover", function () {
    var modal = $("#editEntryModal");
    modal.appendTo(this);
    modal.css("display", "block");
    modal.css("float", "right");

    var deleteEntry = $("#deleteEntry");
    deleteEntry.appendTo(modal);
    SetCssOnMouseover(deleteEntry);
});

$(".expenseEntry").on("mouseout", function () {
    $("#editEntryModal").css("display", "none");
    $("#deleteEntry").css("display", "none");
});

function setCssOnTempEntryExpenseLabel() {
    $(".tempClassEntryExpenseLabel").css("width", "186px");
    $(".tempClassEntryExpenseLabel").css("height", "26px");
    $(".tempClassEntryExpenseLabel").css("display", "block");
    $(".tempClassEntryExpenseLabel").css("margin-top", "12px");
    $(".tempClassEntryExpenseLabel").css("margin-right", "10px");
    $(".tempClassEntryExpenseLabel").css("float", "left");
    $(".tempClassEntryExpenseLabel").css("font-size", "18px");
    $(".tempClassEntryExpenseLabel").css("font-family", "Segoe UI");
}
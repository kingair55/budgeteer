var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthToNumberMap = {};
monthToNumberMap["January"] = 1;
monthToNumberMap["February"] = 2;
monthToNumberMap["March"] = 3;
monthToNumberMap["April"] = 4;
monthToNumberMap["May"] = 5;
monthToNumberMap["June"] = 6;
monthToNumberMap["July"] = 7;
monthToNumberMap["August"] = 8;
monthToNumberMap["September"] = 9;
monthToNumberMap["October"] = 10;
monthToNumberMap["November"] = 11;
monthToNumberMap["December"] = 12;

function updateSavingsTextColor() {
    var income = parseInt($("#" + "totalIncomeValue").text().replace(/[^0-9]/g, ""));
    var expense = parseInt($("#" + "totalExpenseValue").text().replace(/[^0-9]/g, ""));
    var savings = income - expense;
    $("#" + "savingsValue").text("$" + savings + "");

    if (savings > 0)
        $("#" + "savingsValue").css("color", "#37ad15");
    else if (savings == 0)
        $("#" + "savingsValue").css("color", "black");
    else
        $("#" + "savingsValue").css("color", "red");
}

function hasProperty(object) {
    for (var prop in object) {
        return true;
    }
    return false;
}

function getElementCountByClass(elementClass) {
    return count = $(elementClass).length;
}

$(document).ready(function () {
    var editEntryModal = document.createElement("div");
    editEntryModal.id = "editEntryModal";
    document.getElementById("incomeList").appendChild(editEntryModal);

    var deleteEntry = document.createElement("input");
    deleteEntry.id = "deleteEntry";
    deleteEntry.type = "button";
    deleteEntry.value = "Delete";

    document.getElementById(editEntryModal.id).appendChild(deleteEntry);
    $("#" + editEntryModal.id).css("width", "150px");
    $("#" + editEntryModal.id).css("height", "50px");
    $("#" + editEntryModal.id).css("background-color", "#ffffff");
    $("#" + editEntryModal.id).css("display", "none");

    $("#deleteEntry").on("click", function () {
        var entryToDelete = $(this).parent().parent();
        $("#editEntryModal").appendTo($("#incomeList"));

        var url = "/Home/DeleteEntry";
        var type = 0;
        var entryPosition = 0;
        var username = $("#username").text();
        var usernameLength = username.length;

        if (entryToDelete.attr("id").indexOf("income") > -1)
            type = 1;
        else
            type = 2;

        entryPosition = parseInt(entryToDelete.attr("id").slice(-1));

        $.post(url, { type: type, position: entryPosition, username: username.substring(6, usernameLength - 1) }, function (result) { alert(result); }, "json");

        entryToDelete.remove();

        $("#editEntryModal").css("display", "none");
        $("#deleteEntry").css("display", "none");

        UpdateValues();
        updateSavingsTextColor();
        ReSequenceEntryLabelAndInputIdIndex();
    });

    SetTotalDiv();
});

function GetTotal(entryClass) {
    var total = 0;
    $(entryClass).each(function () {
        total += parseInt(this.value);
    });
    return total;
}

function UpdateValues() {
    var total = 0;
    $(".incomeInput").each(function () {
        var elem = $(this);
        total += parseInt(elem.val().replace(/[^0-9]/g, "")) || 0;
    });
    $("#totalIncomeValue").text("$" + total);
    total = 0;
    $(".expenseInput").each(function () {
        var elem = $(this);
        total += parseInt(elem.val().replace(/[^0-9]/g, "")) || 0;
    });
    $("#totalExpenseValue").text("$" + total);
}

function ReSequenceEntryLabelAndInputIdIndex() {
    var index = 1;
    $(".incomeEntry").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
    index = 1;
    $(".incomeType").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
    index = 1;
    $(".incomeInput").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
    index = 1;
    $(".expenseEntry").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
    index = 1;
    $(".expenseType").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
    index = 1;
    $(".expenseInput").each(function () {
        this.id = this.id.replace(/[0-9]/g, "") + index;
        index++;
    });
}

function SetCssOnMouseover(elem) {
    $(elem).css("display", "block");
    $(elem).css("width", "70px");
    $(elem).css("height", "30px");
    $(elem).css("margin-top", "10px");
    $(elem).css("margin-left", "40px");
    $(elem).css("margin-right", "40px");
    $(elem).css("font-size", "16px");
    $(elem).css("font-family", "Segoe UI");
    $(elem).css("background-color", "#f6f6f6");
    $(elem).css("border", "none");
}

$("#monthDiv").click(function () {
    if ($("#monthListPopupDiv").length) {
        $("#monthListPopupDiv").remove();
        return;
    }

    var newDiv = document.createElement("div");
    newDiv.setAttribute("id", "monthListPopupDiv")
    var newList = document.createElement("ul");

    for(var x = 0; x < months.length; x++)
    {
        var newItem = document.createElement("li");
        var textNode = document.createTextNode(months[x]);
        newItem.appendChild(textNode);
        $(newItem).addClass("monthItem");

        if (months[x] == $("#lblMonth").text()) {
            $(newItem).removeClass();
            $(newItem).addClass("monthItemSelected");
        }

        $(newItem).on("click", function () {
            $(document.getElementsByClassName("monthItemSelected")).removeClass().addClass("monthItem");
            $(this).addClass("monthItemSelected");
            $("#lblMonth").text($(this).text());

            $.ajax({
                url: "/Home/UpdateEntries",
                type: "GET",
                data: { month: monthToNumberMap[$("#lblMonth").text()], year: 2015 }
            })
            .done(function (partialViewResult) {
                $("#userDataDiv").html(partialViewResult).animate({}, "2000");
                SetTotalDiv();
            });
        });

        newList.appendChild(newItem);
    }
    $(newList).addClass("monthList");
    newDiv.appendChild(newList);
    $(newDiv).addClass("monthListDiv");
    $(newDiv).appendTo(this);
});

function SetTotalDiv()
{
    var totalIncome = GetTotal(".incomeInput");
    if (totalIncome > 0)
        $("#totalIncomeValue").text("$" + totalIncome);
    else
        totalIncome = parseInt($("#totalIncomeValue").text());

    var totalExpense = GetTotal(".expenseInput");
    if (totalExpense > 0)
        $("#totalExpenseValue").text("$" + totalExpense);
    else
        totalExpense = parseInt($("#totalIncomeValue").text());

    if (totalIncome > 0 || totalExpense > 0) {
        $("#savingsValue").text("$" + (totalIncome + totalExpense));

        updateSavingsTextColor();
    }
}

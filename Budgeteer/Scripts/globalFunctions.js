var currentYear = new Date().getFullYear();
var years = [currentYear - 4, currentYear - 3, currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4, currentYear + 5];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthToNumberMap = {};
monthToNumberMap[months[0]] = 1;
monthToNumberMap[months[1]] = 2;
monthToNumberMap[months[2]] = 3;
monthToNumberMap[months[3]] = 4;
monthToNumberMap[months[4]] = 5;
monthToNumberMap[months[5]] = 6;
monthToNumberMap[months[6]] = 7;
monthToNumberMap[months[7]] = 8;
monthToNumberMap[months[8]] = 9;
monthToNumberMap[months[9]] = 10;
monthToNumberMap[months[10]] = 11;
monthToNumberMap[months[11]] = 12;

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
    SetEditEntryModal();

    AttachClickEventToDeleteEntryIncome();
    AttachClickEventToDeleteEntryExpense();

    SetValuesInTotalDiv();
});

function AttachClickEventToDeleteEntryIncome() {
    $("#deleteEntry").on("click", function () {
        var entryToDelete = $(this).parent().parent();
        $("#editEntryModal").appendTo($("#incomeList"));

        var url = "/Home/DeleteEntry";
        var month = monthToNumberMap[$("#lblMonth").text()];
        var year = parseInt($("#lblYear").text());
        var type = 0;
        var entryPosition = 0;
        var username = $("#username").text();
        var usernameLength = username.length;

        if (entryToDelete.attr("id").indexOf("income") > -1)
            type = 1;
        else
            type = 2;

        entryPosition = parseInt(entryToDelete.attr("id").slice(-1));

        $.post(url, { year: year, month: month, type: type, position: entryPosition, username: username.substring(6, usernameLength - 1) }, function (result) { alert(result); }, "json");

        entryToDelete.remove();

        $("#editEntryModal").css("display", "none");
        $("#deleteEntry").css("display", "none");

        UpdateValues();
        updateSavingsTextColor();
        ReSequenceEntryLabelAndInputIdIndex();
    });
}

function AttachClickEventToDeleteEntryExpense() {
    $("#deleteEntry").on("click", function () {
        var entryToDelete = $(this).parent().parent();
        $("#editEntryModal").appendTo($("#expenseList"));

        var url = "/Home/DeleteEntry";
        var month = monthToNumberMap[$("#lblMonth").text()];
        var year = parseInt($("#lblYear").text());
        var type = 0;
        var entryPosition = 0;
        var username = $("#username").text();
        var usernameLength = username.length;

        if (entryToDelete.attr("id").indexOf("expense") > -1)
            type = 1;
        else
            type = 2;

        entryPosition = parseInt(entryToDelete.attr("id").slice(-1));

        $.post(url, { year: year, month: month, type: type, position: entryPosition, username: username.substring(6, usernameLength - 1) }, function (result) { alert(result); }, "json");

        entryToDelete.remove();

        $("#editEntryModal").css("display", "none");
        $("#deleteEntry").css("display", "none");

        UpdateValues();
        updateSavingsTextColor();
        ReSequenceEntryLabelAndInputIdIndex();
    });
}

function SetEditEntryModal() {
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
}

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
    $("#yearListPopupDiv").remove();
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
        var labelMonth = document.createElement("label");
        $(labelMonth).text(months[x]);
        newItem.appendChild(labelMonth);
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
                data: { month: monthToNumberMap[$("#lblMonth").text()], year: parseInt($("#lblYear").text()) }
            })
            .done(function (partialViewResult) {
                $("#userDataDiv").html(partialViewResult).animate({}, "2000");
                SetValuesInTotalDiv();
                ReattachIncomeEventListeners();
                ReattachExpenseEventListeners();
            });
        });

        newList.appendChild(newItem);
    }
    $(newList).addClass("monthList");
    newDiv.appendChild(newList);
    $(newDiv).addClass("monthListDiv");
    $(newDiv).appendTo(this);
});

$("#yearDiv").click(function () {
    $("#monthListPopupDiv").remove();
    if ($("#yearListPopupDiv").length) {
        $("#yearListPopupDiv").remove();
        return;
    }

    var newDiv = document.createElement("div");
    newDiv.setAttribute("id", "yearListPopupDiv")
    var newList = document.createElement("ul");

    for (var x = 0; x < years.length; x++) {
        var newItem = document.createElement("li");
        var labelYear = document.createElement("label");
        $(labelYear).text(years[x]);
        newItem.appendChild(labelYear);
        $(newItem).addClass("yearItem");

        if (years[x] == $("#lblYear").text()) {
            $(newItem).removeClass();
            $(newItem).addClass("yearItemSelected");
        }

        $(newItem).on("click", function () {
            $(document.getElementsByClassName("yearItemSelected")).removeClass().addClass("yearItem");
            $(this).addClass("yearItemSelected");
            $("#lblYear").text($(this).text());

            $.ajax({
                url: "/Home/UpdateEntries",
                type: "GET",
                data: { month: monthToNumberMap[$("#lblMonth").text()], year: parseInt($("#lblYear").text()) }
            })
            .done(function (partialViewResult) {
                $("#userDataDiv").html(partialViewResult).animate({}, "2000");
                SetValuesInTotalDiv();
                ReattachIncomeEventListeners();
                ReattachExpenseEventListeners();
            });
        });

        newList.appendChild(newItem);
    }
    $(newList).addClass("yearList");
    newDiv.appendChild(newList);
    $(newDiv).addClass("yearListDiv");
    $(newDiv).appendTo(this);
});

function SetValuesInTotalDiv()
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

function ReattachIncomeEventListeners() {
    SetEditEntryModal();
    AttachClickEventToDeleteEntryIncome();

    $(".incomeEntry").each(function (index, obj) {
        $(this).css("background-color", "white");

        $(this).on("mouseover", function () {
            $("#editEntryModal").appendTo(this);
            $("#editEntryModal").css("display", "block");
            $("#editEntryModal").css("float", "right");

            $("#deleteEntry").appendTo($("#editEntryModal"));
            SetCssOnMouseover($("#deleteEntry"));
        });

        $(this).on("mouseout", function () {
            $("#editEntryModal").css("display", "none");
            $("#deleteEntry").css("display", "none");
        });
    });

    $(".incomeInput").each(function (index, obj) {
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

        elem.on("click", function () {
            $(this).focus().select();
        });

        elem.on("blur", function () {
            updateSavingsTextColor();
            updateIncomeEntry(this);
        });
    });

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
        var elem = $("#" + temp);
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
            updateIncomeEntry(this);
        });

        timeoutIncome = setTimeout(function () {
            $("#" + newDiv.id).css("background-color", "white");
        }, 5000);

        $(".incomeEntry").on("mouseover", function () {
            $("#editEntryModal").appendTo(this);
            $("#editEntryModal").css("display", "block");
            $("#editEntryModal").css("float", "right");

            $("#deleteEntry").appendTo($("#editEntryModal"));
            SetCssOnMouseover($("#deleteEntry"));
        });

        $(".incomeEntry").on("mouseout", function () {
            $("#editEntryModal").css("display", "none");
            $("#deleteEntry").css("display", "none");
        });

        if ($("#username").length > 0)
            AddIncomeEntry(elementCount);
    });
}

function updateIncomeEntry(elem) {
    var url = "/Home/UpdateEntry";
    var entryPosition = 0;
    var name = "";
    var value = 0;
    var month = monthToNumberMap[$("#lblMonth").text()];
    var year = parseInt($("#lblYear").text());
    var username = $("#username").text();
    var usernameLength = username.length;
    var entryId = $(elem).attr("id");
    entryPosition = parseInt(entryId.slice(-1));

    name = $("#" + "incomeLabel" + entryPosition).text();
    value = parseInt($("#" + "incomeField" + entryPosition).val()) || -1;

    if (name != "Click to edit" && value > 0)
        $.post(url, { year: year, month: month, type: 1, position: entryPosition, name: name, value: value, username: username.substring(6, usernameLength - 1) }, function (result) { alert(result); }, "json");
}

function AddIncomeEntry(entryPosition) {
    var url = "/Home/AddEntry";
    var username = $("#username").text();
    var usernameLength = username.length;
    var entryYear = $("#lblYear").text();
    var entryMonth = $("#lblMonth").text();

    $.post(url,
            { type: 1, year: parseInt(entryYear), month: monthMap[entryMonth], position: entryPosition, name: "", value: 0, username: username.substring(6, usernameLength - 1) },
            function (result) { alert(result); },
            "json"); //1 = Income based from EntryType enum
}

function ReattachExpenseEventListeners() {
    SetEditEntryModal();
    AttachClickEventToDeleteEntryExpense();

    $(".expenseEntry").each(function (index, obj) {
        $(this).css("background-color", "white");

        $(this).on("mouseover", function () {
            $("#editEntryModal").appendTo(this);
            $("#editEntryModal").css("display", "block");
            $("#editEntryModal").css("float", "right");

            $("#deleteEntry").appendTo($("#editEntryModal"));
            SetCssOnMouseover($("#deleteEntry"));
        });

        $(this).on("mouseout", function () {
            $("#editEntryModal").css("display", "none");
            $("#deleteEntry").css("display", "none");
        });
    });

    $(".expenseInput").each(function (index, obj) {
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

        elem.on("click", function () {
            $(this).focus().select();
        });

        elem.on("blur", function () {
            updateSavingsTextColor();
            updateExpenseEntry(this);
        });
    });

    $("#addExpense").click(function () {
        var linebreak = document.createElement("br");
        var newDiv = document.createElement("div");
        var newLabel = document.createElement("label");
        var newInput = document.createElement("input");
        var elementCount = parseInt(getElementCountByClass(".expenseType")) + parseInt("1");
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
        var elem = $("#" + temp);
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
            $("#" + newDiv.id).css("background-color", "white");
        }, 5000);

        $(".expenseEntry").on("mouseover", function () {
            $("#editEntryModal").appendTo(this);
            $("#editEntryModal").css("display", "block");
            $("#editEntryModal").css("float", "right");

            $("#deleteEntry").appendTo($("#editEntryModal"));
            SetCssOnMouseover($("#deleteEntry"));
        });

        $(".expenseEntry").on("mouseout", function () {
            $("#editEntryModal").css("display", "none");
            $("#deleteEntry").css("display", "none");
        });

        if ($("#username").length > 0)
            AddExpenseEntry(elementCount);
    });
}

function AddExpenseEntry(entryPosition) {
    var url = "/Home/AddEntry";
    var username = $("#username").text();
    var usernameLength = username.length;
    var entryYear = $("#lblYear").text();
    var entryMonth = $("#lblMonth").text();

    $.post(url,
            { type: 2, year: parseInt(entryYear), month: monthMap[entryMonth], position: entryPosition, name: "", value: 0, username: username.substring(6, usernameLength - 1) },
            function (result) { alert(result); },
            "json"); //2 = Expense based from EntryType enum
}

function updateExpenseEntry(elem) {
    var url = "/Home/UpdateEntry";
    var entryPosition = 0;
    var name = "";
    var value = 0;
    var month = monthToNumberMap[$("#lblMonth").text()];
    var year = parseInt($("#lblYear").text());
    var username = $("#username").text();
    var usernameLength = username.length;
    var entryId = $(elem).attr("id");
    entryPosition = parseInt(entryId.slice(-1));

    name = $("#" + "expenseLabel" + entryPosition).text();
    value = parseInt($("#" + "expenseField" + entryPosition).val()) || -1;

    if (name != "Click to edit" && value > 0)
        $.post(url,
            { year: year, month: month, type: 2, position: entryPosition, name: name, value: value, username: username.substring(6, usernameLength - 1) },
            function (result) { alert(result); },
            "json");
}
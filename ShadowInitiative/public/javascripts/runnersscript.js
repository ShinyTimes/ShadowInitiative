var host = "http://localhost:3000/";
var runners = "runners/";
var api = runners + "api/";
var ct = "Content-type";
var appJ = "application/json";

var activeRunners = null;
var passCount = -1;
var selectedRunner = -1;

//
// Functionality
//
function sortByInit()
{
    activeRunners.sort(function (a, b)
    {
        if (b.excluded || a.currentInit > b.currentInit)
            return -1;
        else if (a.excluded || a.currentInit < b.currentInit)
            return 1;
        else if (a.currentInit === b.currentInit)
        {
            if (a.baseInit > b.baseInit)
                return -1;
            else if (a.baseInit < b.baseInit)
                return 1;
            else if (a.baseInit === b.baseInit)
            {
                if (a.dice > b.dice)
                    return -1;
                else if (a.dice < b.dice)
                    return 1;
                else return 0;
            }
        }
    });
}

function roll(index)
{
    var value = activeRunners[index].baseInit;
    for (var i = 0; i < activeRunners[index].dice; i++)
    {
        value += Math.floor((Math.random() * 6) + 1);
    }
    activeRunners[index].currentInit = value - (passCount * 10);
}

function rollWithUpdate(index)
{
    activeRunners[index].excluded = false;
    roll(index);
    sortByInit();
    uiUpdateRunners();
}



function rollAll()
{
    passCount = 0;
    for (var i = 0; i < activeRunners.length; i++)
    {
        if (!activeRunners[i].excluded)
            roll(i);
    }
    sortByInit();
    uiUpdateRunners();
}

function subtractInitiative(index, amount)
{
    if (index > -1 && !activeRunners[index].excluded)
    {
        activeRunners[index].currentInit -= amount;

        if (activeRunners[index].currentInit < 0)
            activeRunners[index].currentInit = 0;
    }

}

function subtractInitiativeAndUpdate(index, amount)
{
    subtractInitiative(index, amount);
    sortByInit();
    uiUpdateRunners();
}

function newPass()
{
    passCount++;
    for (var i = 0; i < activeRunners.length; i++)
    {
        // Subtracts 10 initative per pass
        subtractInitiative(i, 10);
    }

    uiUpdateRunners();
}

//
// CRUD
//
function uiAddRunner(index, runner)
{
    selectedRunner = -1;

    $("#activeRunners").append('<li id="' + index + '">'
        + '<div>Name: ' + runner.name + '</div>'
        + '<div>Base Init: ' + runner.baseInit + '</div>'
        + '<div>Dice: ' + runner.dice + '</div>'
        + '<div>Exclude: <input type="checkbox" >'
        + '</div >' 
        + '<div class="roll"></div>'
        + '<button onclick="rollWithUpdate(' + index + ')">'
        //+ '<button onclick="roll(\'' + runner._id + '\')">'
        + 'Roll</button>'
        + '<button onclick=\'deleteRunner(' + index + ')\'>'
        + 'X</button>'
        + '</li>');

    if (!runner.excluded && passCount > -1)
    {
        $('#' + index + ' .roll').html("Initiative: " + runner.currentInit);

        if (runner.currentInit === 0)
            $("#" + index).css("border", "red dotted");
    }

    $("#" + index + " :checkbox").prop("checked", runner.excluded);
}


function uiRunnerCreated(runner)
{
    $("#info").html("Runner Created: " + runner.name);
}

// Create
function createRunner(name, dice, baseInit)
{
    //var someObj = { fe, bla};
    
    var runner = { name, dice, baseInit };
    console.log(JSON.stringify(runner));
    $.ajax(
        {
            type: "POST",
            url: host + api,
            data: JSON.stringify(runner),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            success: function (data)
            {
                runner._id = data;
                var index = activeRunners.push(runner) - 1;
                console.log(index);
                uiRunnerCreated(runner);
                uiAddRunner(index, runner);
            }
        });

    //$.post(host + api, JSON.stringify(runner), function (data, status)
    //{
    //    runner._id = data;
    //    var index = activeRunners.push(runner) - 1;
    //    console.log(index);
    //    uiRunnerCreated(runner);
    //    uiAddRunner(index, runner);
    //});
}


// Read
function uiUpdateRunners()
{
    $("#activeRunners").html("");
    activeRunners.forEach(function (runner, index, arr)
    {
        uiAddRunner(index, runner);
    });
    addExclusionListeners();
    addCoolness();
    addQuickhandSubtractListener();
}

//function uiUpdateRunners()
//{
//    $("#activeRunners").html("");
//    uiAddRunners();
//}

// get all runners
function getRunners()
{
    $.getJSON(host + api, function (data)
    {
        activeRunners = data;
        for (var i = 0; i < activeRunners.length; i++)
        {
            activeRunners[i].excluded = false;
            activeRunners[i].currentInit = 0;
        }
        uiUpdateRunners();
    });
}

// Delete
function uiDeleteRunner(runner, index)
{
    console.log("Delete complete");
    $('#info').html("Deleted: " + runner.name);
}

function deleteRunner(index)
{
    let runner = activeRunners[index];
    $.ajax(
        {
            type: "DELETE",
            url: host + api + runner._id,
            success: function (result)
            {
                uiDeleteRunner(runner, index);
                activeRunners.splice(index, 1);
                uiUpdateRunners();
            }
        });
}

// EventListeners
function addExclusionListeners()
{
    $("#activeRunners input[type='checkbox']").change(function ()
    {
        console.log("EXCLUDED!!!");

        var index = $(this).parent().parent().attr("id");

        if ($(this).is(':checked'))
        {
            activeRunners[index].excluded = true;
        } else
        {
            activeRunners[index].excluded = false;
        }

        if (passCount > -1)
        {
            uiUpdateRunners();
            console.log("Also updates ui");
        }
    });
}

function addSubmitListener()
{
     $("#runnersubmit").bind("click", function ()
        {
            var name = $("#name").val();
            var dice = $("#dice").val();
            var baseInit = $("#baseInit").val();

            if ($.isNumeric(dice))
                dice = parseInt(dice);

            if ($.isNumeric(baseInit))
                baseInit = parseInt(baseInit);

            if (name != "" && dice > 0 && dice > 0)
                createRunner(name, dice, baseInit);

     });
}

function addCoolness()
{
    $("#activeRunners li").click(function ()
    {
        var lastSelected = selectedRunner;
        selectedRunner = $(this).attr("id");

        if (lastSelected === selectedRunner)
        {
            $("#" + lastSelected).css("background", "");
            selectedRunner = -1;
        }
        else
        {
            $("#" + selectedRunner).css("background", "peachpuff");
            if (lastSelected > -1)
            {
                $("#" + lastSelected).css("background", "");
            }
        }
    });
}

function addQuickhandSubtractListener()
{
    $("#dodge").click(function ()
    {
        subtractInitiativeAndUpdate(selectedRunner, 5);
    });

    $("#parry").click(function ()
    {
        subtractInitiativeAndUpdate(selectedRunner, 5);
    });

    $("#block").click(function ()
    {
        subtractInitiativeAndUpdate(selectedRunner, 5);
    });

    $("#fullDefense").click(function ()
    {
        subtractInitiativeAndUpdate(selectedRunner, 10);
    });

    $("#intercept").click(function ()
    {
        subtractInitiativeAndUpdate(selectedRunner, 5);
    });

}

//Initial Run
function initPage()
{
    getRunners();

    addSubmitListener();
}

initPage();
function seeRunners()
{
    console.log(activeRunners);
}
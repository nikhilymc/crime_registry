
function addCase(event) {
    event.preventDefault();
    let pry_key = document.getElementById("key").value;
    let aadhaarn = document.getElementById("aadhaar_numb").value;
    let nam = document.getElementById("name").value;
    let case_id = document.getElementById("caseid").value;
    let typ = document.getElementById("case-type").value;
    let dist = document.getElementById("district").value;
    let pst = document.getElementById("ps").value;
    let st = document.getElementById("st").value;
    if (pry_key == "" || aadhaarn == "" || nam == "" || case_id == "" || typ == "" || dist == "" || pst == "" || st == "") {
        alert("Please fill data");
    } else {
        fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: pry_key, aadhaar: aadhaarn, name: nam, id: case_id, type: typ, district: dist, ps: pst, stu: st })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                document.location.reload();
                alert(data.message);
            })
            .catch(function (err) {
                console.log(err);
                alert("Error in processing request");
            })
    }
}

function viewdetails(event) {
    event.preventDefault();
    let adh = document.getElementById("aadhaar").value;
    if (adh == "") {
        alert("Please fill data");
        location.reload();
    } else {
        fetch('/viewdetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ aadhaar: adh })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var trHTML = "";
                data.pdetails.forEach(details => {
                    if (!details.aadhaar) return;
                    trHTML += "<tr><td>" + details.aadhaar + "</td><td>" + details.name + "</td><td>" + details.id + "</td><td>" + details.type + "</td><td>" + details.dist + "</td><td>" + details.ps + "</td><td>" + details.ts + "</td></tr>";
                });
                $("#CrimeReg").empty().append(trHTML);
            })
            .catch(function (err) {
                console.log(err);
                alert("Error in processing request");
            })
    }
};

function viewupdate(event) {
    event.preventDefault();
    let adh = document.getElementById("adh").value;
    let case_id = document.getElementById("case_id").value;
    if (adh == "" || case_id == "") {
        alert("Please fill data");
        location.reload();
    } else {
        fetch('/updatedetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ aadhaar: adh, id: case_id })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                document.getElementById("aadhaar").value = data.aadhaar;
                document.getElementById("name").value = data.name;
                document.getElementById("id").value = data.case_id;
                document.getElementById("type").value = data.type;
                document.getElementById("dist").value = data.dist;
                document.getElementById("ps").value = data.ps;
                document.getElementById("status").value = data.ts;
            })
            .catch(function (err) {
                console.log(err);
                alert("Error in processing request");
            })
    }
}

function statuschange(event) {
    event.preventDefault();
    let pry_key = document.getElementById("key").value;
    let aadhaarn = document.getElementById("aadhaar").value;
    let nam = document.getElementById("name").value;
    let case_id = document.getElementById("id").value;
    let typ = document.getElementById("type").value;
    let dist = document.getElementById("dist").value;
    let pst = document.getElementById("ps").value;
    let st = document.getElementById("status").value;
    if (pry_key == "" || aadhaarn == "" || nam == "" || case_id == "" || typ == "" || dist == "" || pst == "" || st == "") {
        alert("Please fill data");
    } else {
        fetch('/statusChange', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: pry_key, aadhaar: aadhaarn, name: nam, id: case_id, type: typ, district: dist, ps: pst, stu: st })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                document.location.reload();
                alert(data.message);
                setTimeout(function () {
                    document.location.reload();
                }, 200);
            })
            .catch(function (err) {
                console.log(err);
                alert("Error in processing request");
            })
    }
}

function deleteCase(event) {
    event.preventDefault();
    let pry_key = document.getElementById("key").value;
    let aadhaarn = document.getElementById("aadhaar").value;
    let case_id = document.getElementById("id").value;
    if (pry_key == "" || aadhaarn == "" || case_id == "") {
        alert("Please fill data");
    } else {
        fetch('/deletecase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: pry_key, aadhaar: aadhaarn, id: case_id })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                document.location.reload();
                alert(data.message);
                setTimeout(function () {
                    document.location.reload();
                }, 200);
            })
            .catch(function (err) {
                console.log(err);
                alert("Error in processing request");
            })
    }
}

function transactionreceipt(event) {
    event.preventDefault();
    let receipt = document.getElementById("receipt").value;
    if (receipt == "")
        alert("please fill the data");
    else {
        fetch('/trnreceipt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rec: receipt })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var json = JSON.stringify(data.transactionData, null, 2);
                document.getElementById("id").innerHTML = json;
            })
            .catch(function (err) {
                console.log(err);
                alert("Error in processing request");
            })
    }
}
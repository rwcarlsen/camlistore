/*
Copyright 2011 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function btnCreateNewPermanode(e) {
    camliCreateNewPermanode(
        {
            success: function(blobref) {
               window.location = "./?p=" + blobref;
            },
            fail: function(msg) {
                alert("create permanode failed: " + msg);
            }
        });
}

function handleFormGetTagged(e) {
    e.stopPropagation();
    e.preventDefault();

    var input = document.getElementById("inputTag");
    var btn = document.getElementById("btnGetTagged");

    if (input.value == "") {
        return;
    }

    var tags = input.value.split(/\s*,\s*/);

    var sigcb = {};
    sigcb.success = function(sigconf) {
		var tagcb = {};
		tagcb.success = function(pres) {
			showTaggedPermanodes(pres);
		};
        camliGetTaggedPermanodes(sigconf.publicKeyBlobRef, tags[0], tagcb);
    };
    sigcb.fail = function() {
        alert("sig disco failed");
    }
    camliSigDiscovery(sigcb);
}

function indexOnLoad(e) {
   var btnNew = document.getElementById("btnNew");
    if (!btnNew) {
        alert("missing btnNew");
    }
    btnNew.addEventListener("click", btnCreateNewPermanode);
    camliGetRecentlyUpdatedPermanodes({ success: indexBuildRecentlyUpdatedPermanodes });
    formTags.addEventListener("submit", handleFormGetTagged);

    if (disco && disco.uploadHelper) {
        var uploadForm = document.getElementById("uploadform");
        uploadform.action = disco.uploadHelper;
        document.getElementById("fileinput").disabled = false;
        document.getElementById("filesubmit").disabled = false;
        var chkRollSum = document.getElementById("chkrollsum");
        chkRollSum.addEventListener("change", function (e) {
                                        if (chkRollSum.checked) {
                                            if (disco.uploadHelper.indexOf("?") == -1) {
                                                uploadform.action = disco.uploadHelper + "?rollsum=1";
                                            } else {
                                                uploadform.action = disco.uploadHelper + "&rollsum=1";
                                            }
                                        } else {
                                            uploadform.action = disco.uploadHelper;
                                        }
                                    });
    }
}

function showTaggedPermanodes(searchRes) {
    var div = document.getElementById("tagged");
    div.innerHTML = "";
    for (var i = 0; i < searchRes.tagged.length; i++) {
        var result = searchRes.tagged[i];
        var pdiv = document.createElement("li");
        var alink = document.createElement("a");
        alink.href = "./?p=" + result.permanode;
        alink.innerText = camliBlobTitle(result.permanode, searchRes);
        pdiv.appendChild(alink);
        div.appendChild(pdiv);
    }
}

function indexBuildRecentlyUpdatedPermanodes(searchRes) {
    var div = document.getElementById("recent");
    div.innerHTML = "";
    for (var i = 0; i < searchRes.recent.length; i++) {
        var result = searchRes.recent[i];      
        var pdiv = document.createElement("li");
        var alink = document.createElement("a");
        alink.href = "./?p=" + result.blobref;
        alink.innerText = camliBlobTitle(result.blobref, searchRes);
        pdiv.appendChild(alink);
        div.appendChild(pdiv);
    }
}

window.addEventListener("load", indexOnLoad);
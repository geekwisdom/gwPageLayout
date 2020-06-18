"use strict";
/********************************************************************************
Script Name: gwSettings.js
@(#) Purpose: This script allows the user to get / set settings within the browser
@(#) It provides 2 functions, "GetSetting", and "SetSetting" which will store 
@(#) information locally to the browser using either an IndexedDB, LocalStorage
@(#) or cookies depending upon browser support. This script assumes that the @(#) file is also included to work properly. It also assumes a settings db variable
@(#) exits (eg: SettingsDB)
Note: Due to the nature of indexdb, and asynchronos calls, the GetSetting Function must have passed in a call back function that is called when the setting is returned.
**********************************************************************************
Written By: Brad Detchevery
Created: May 26, 2019
********************************************************************************
MIT License [MODIFIED COPYRIGHT NOTICE]

-- BEGIN COPYRIGHT NOTICE --
Copyright (c) 2019 Brad Detchevery
This product uses GeekWisdom.org Software, and has been provided FREE OF CHARGE.
If you like it please consider becoming a Patron at https://patreon.com/GeekWisdom
-- END COPYRIGHT NOTICE --

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice (text between the -- BEGIN COPYRIGHT NOTICE -- and -- END COPYRIGHT NOTICE --)
and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

********************************************************************************/


function gwSetting()
{
this.DefaultDB="SettingsDB";

/* Private */
this.LogInfo = function (msg,LogLevel)
{
if (typeof gwLogger == "undefined")
  {
  console.log(msg);
  }
else
 {
 var verbose=1;
 if (typeof LogVerbosity == "undefined") verbose=1;
 else verbose=LogVerbosity;
 let l=new gwLogger(verbose);
 l.LogInfo(msg,LogLevel);
 }
}

/* Private */
this.supports_html5_storage = function ()
{
    try { 
    window.localStorage.setItem("test","test");
    return true;
    } 
    catch (e) {
    return false; 
    } 
}
 

}

gwSetting.prototype.WriteSetting = function (IName,IValue)
{
    var store = this.supports_html5_storage();
    if (store) {
        this.LogInfo("Local storage found! Setting Item", 1);
        window.localStorage.setItem(IName, IValue);
    }
    else {
        this.LogInfo("No local stroage, trying cookie method");
        var d = new Date();
        d.setTime(d.getTime() + (5 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = IName + "=" + IValue + "; " + expires;
    }
}

gwSetting.prototype.GetArgument = function (name)
{
//Parse a URL
name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.href);
	if (results == null) {
		return '';
	} else {
		return results[1];
	}
}

gwSetting.prototype.GetSetting = function (IName)
{
    var store = this.supports_html5_storage();
    if(store) 
    {
        this.LogInfo("Local storage found!",1);
        var retval = window.localStorage.getItem(IName);
        return retval;

    }
    else
    {
        //use cookies
        var name = IName + "=";
        this.LogInfo("No Local storage found! - using cookies",1);
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) 
        {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) { return c.substring(name.length,c.length); 
            }
        }
        return "";
    } 

}

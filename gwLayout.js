/********************************************************************************
Script Name: gwLayout.js
@(#) Purpose: This class implements the ability of 'drag & drop' fields. It allows
@(#) a user to move fields around on a page, and 'save' the layout. It also supports
@(#) a 'read' only mode which merges the fields with the layout, but does not allow
@(#) the user to move things around.


**********************************************************************************
Written By: Brad Detchevery
Created: June 9, 2020
********************************************************************************/
function gwLayout(_layout)
{
this.LayoutDetails = _layout;
this.enabled=false;
this.deployed=false;
}

gwLayout.prototype.applyLayout = function()
{
var LayoutDetails = this.LayoutDetails;
//Given the JSON 'LayoutDetails' apply it to the page with placeholders
//Placeholders are assumed to be of the format gwPlaceHolder_ID_X
//walk through all div-elements
//first we need to push all existing layout elements into a tempary 'hidden' spot

for (let key in LayoutDetails) 
    {
    if (LayoutDetails.hasOwnProperty(key)) 
        {

	 var childId=LayoutDetails[key];
	 var parentId=key;
     	 var parentEl=document.getElementById(parentId);
     	 var childEl=document.getElementById(childId);
	 if (((typeof(parentEl) != 'undefined' && parentEl != null)) && ((typeof(childEl) != 'undefined' &&     childEl != null)))
		{

		parentEl.appendChild(childEl);
		}
         }
     }
}

gwLayout.prototype.getCurrentLayout = function()
{
var _newLayoutDetails={}
//return the current layout dtails

var LayoutDetails = this.LayoutDetails;
//Given the JSON 'LayoutDetails' apply it to the page with placeholders
//Placeholders are assumed to be of the format gwPlaceHolder_ID_X
//walk through all div-elements
//first we need to push all existing layout elements into a tempary 'hidden' spot

for (let key in LayoutDetails) 
    {
    if (LayoutDetails.hasOwnProperty(key)) 
        {

         var childId = document.getElementById(key).children[0].id;
         _newLayoutDetails[key]=childId;
        }
     }
return _newLayoutDetails;
}

gwLayout.prototype.disableDragDrop = function()
{
var LayoutDetails = this.LayoutDetails;

var removeBorders = function (LayoutDetails)
{

var self=this;
for (let key in LayoutDetails) 
    {
    if (LayoutDetails.hasOwnProperty(key)) 
        {
	 var childId=LayoutDetails[key];
	 var parentId=key;
     	 var parentEl=document.getElementById(parentId);
     	 var childEl=document.getElementById(childId);
	 if (((typeof(parentEl) != 'undefined' && parentEl != null)) && ((typeof(childEl) != 'undefined' &&     childEl != null)))
		{
		childEl.classList.remove("gwDottedLayout");	
		}
         }
     }

}



removeBorders(LayoutDetails);
this.enabled=false;


}

gwLayout.prototype.enableDragDrop = function()
{

var self=this;
//enable drag & drop for each Placeholder (add javascript drag/drop functions) or 'enable'/'disable' the drag/drop flag?
var LayoutDetails = this.LayoutDetails;
var self=this;

var ondrop = function (ev)
{
if (self.enabled) 
 {
 ev.preventDefault ();
  var srcEl = document.getElementById (ev.dataTransfer.getData ("text"));

  var srcParent = srcEl.parentNode;
  var tgt = ev.currentTarget.firstElementChild;
  ev.currentTarget.replaceChild (srcEl, tgt);
  srcParent.appendChild (tgt);
  }
}

var ondrag = function (ev)
{
 if (self.enabled)
  {
 ev.dataTransfer.setData("text", ev.target.id);
  }
}

var allowDrop = function (ev)
{
 if (self.enabled)
  {
 ev.preventDefault();
  }
}

var addDragDropListners = function (LayoutDetails, dodrag,dodrop,allowdrop)
 {
var self=this;

for (let key in LayoutDetails) 
    {
    if (LayoutDetails.hasOwnProperty(key)) 
        {

	 var childId=LayoutDetails[key];
	 var parentId=key;
     	 var parentEl=document.getElementById(parentId);
     	 var childEl=document.getElementById(childId);
	 if (((typeof(parentEl) != 'undefined' && parentEl != null)) && ((typeof(childEl) != 'undefined' &&     childEl != null)))
		{
		parentEl.addEventListener("drop",function (ev) { dodrop(ev); });
       	         parentEl.addEventListener("dragover",function (ev) { allowdrop(ev); });
		childEl.setAttribute("draggable","true");
		parentEl.addEventListener("dragstart",function (ev) { dodrag(ev); });	
		}
         }
     }
 }

var addBorders = function (LayoutDetails)
{
var self=this;
for (let key in LayoutDetails) 
    {
	
    if (LayoutDetails.hasOwnProperty(key)) 
        {
	 var childId=LayoutDetails[key];
	 var parentId=key;
     	 var parentEl=document.getElementById(parentId);
     	 var childEl=document.getElementById(childId);
	
	 if (((typeof(parentEl) != 'undefined' && parentEl != null)) && ((typeof(childEl) != 'undefined' &&     childEl != null)))
		{
//		alert (parentEl);	
		childEl.classList.add("gwDottedLayout");
		}
         }
     }

}


if (!(self.deployed))
 { 
 self.deployed=true;
 addDragDropListners(LayoutDetails,ondrag,ondrop,allowDrop);
 }
addBorders(LayoutDetails);
self.enabled=true;
}


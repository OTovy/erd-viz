
import {relationItems} from "../script.js";
import {nodes} from "../script.js";

export let init = function () {

        let parent = document.getElementById('diagramWrapper');
        let child = document.getElementById('myDiagramDiv');
        child.remove();
        let newChild = document.createElement('div');
        newChild.setAttribute('id', 'myDiagramDiv');
        parent.appendChild(newChild);

      let $ = go.GraphObject.make;  // for conciseness in defining templates



    let myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
          {
            allowDelete: false,
            allowCopy: false,
              // layout: $(go.ForceDirectedLayout),
              // layout: $(go.CircularLayout),
            "undoManager.isEnabled": true,
            "animationManager.isEnabled": false

          });

      let colors = {
        'red': '#be4b15',
        'green': '#52ce60',
        'blue': '#6ea5f8',
        'lightred': '#fd8852',
        'lightblue': '#afd4fe',
        'lightgreen': '#b9e986',
        'pink': '#faadc1',
        'purple': '#d689ff',
        'orange': '#fdb400',
      }

      // the template for each attribute in a node's array of item data
      let itemTempl =
        $(go.Panel, "Horizontal",
            new go.Binding("portId", "name"),
          $(go.Shape,
            { desiredSize: new go.Size(15, 15), strokeJoin: "round", strokeWidth: 1, stroke: null, margin: 2 },
            new go.Binding("figure", "figure"),
            new go.Binding("fill", "color"),
            new go.Binding("stroke", "color"),
            new go.Binding("info", "info"),
          ),
          $(go.TextBlock,
            {
              stroke: "#333333",
              font: "bold 14px sans-serif",
                margin: new go.Margin(0, 50, 0, 0)
            },
            new go.Binding("text", "name"))
        );

      myDiagram.initialAutoScale = go.Diagram.Uniform;

      // define the Node template, representing an entity
      myDiagram.nodeTemplate =
        $(go.Node, "Auto",  // the whole node panel
          {
            selectionAdorned: true,
            resizable: true,
            layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,
            isShadowed: true,
            shadowOffset: new go.Point(3, 3),
            shadowColor: "#C5C1AA"
          },
          new go.Binding("location", "location").makeTwoWay(),
          new go.Binding("position", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          // whenever the PanelExpanderButton changes the visible property of the "LIST" panel,
          // clear out any desiredSize set by the ResizingTool.
          new go.Binding("desiredSize", "visible", function(v) { return new go.Size(NaN, NaN); }).ofObject("LIST"),
          // define the node's outer shape, which will surround the Table
          $(go.Shape, "RoundedRectangle",
            { fill: 'white', stroke: "#eeeeee", strokeWidth: 3 }),
          $(go.Panel, "Table",
            { margin: 8, stretch: go.GraphObject.Fill},
            $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
            // the table header
            $(go.TextBlock,
              {
                row: 0, alignment: go.Spot.Center,
                margin: new go.Margin(0, 24, 0, 2),  // leave room for Button
                font: "bold 16px sans-serif"
              },
              new go.Binding("text", "key")),
            // the collapse/expand button
            $("PanelExpanderButton", "LIST",  // the name of the element whose visibility this button toggles
              { row: 0, alignment: go.Spot.TopRight }),
            // the list of Panels, each showing an attribute
            $(go.Panel, "Vertical",
              {
                name: "LIST",
                row: 1,
                padding: 3,
                alignment: go.Spot.TopLeft,
                defaultAlignment: go.Spot.Left,
                stretch: go.GraphObject.Horizontal,
                itemTemplate: itemTempl
              },
              new go.Binding("itemArray", "fields"))
          )// end Table Panel
        );  // end Node

      // define the Link template, representing a relationship
      myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
          {
            selectionAdorned: true,
            layerName: "Foreground",
            fromSpot: go.Spot.LeftRightSides,
            toSpot: go.Spot.LeftRightSides,
            reshapable: true,
            routing: go.Link.AvoidsNodes,
            // routing: go.Link.Orthogonal,
            // curve: go.Link.JumpOver
            // curve: go.Link.Bezier
            curve: go.Link.JumpGap,
            corner: 100
          },
          $(go.Shape,  // the link shape
            { stroke: "#303B45", strokeWidth: 2.5 }),
          $(go.TextBlock,  // the "from" label
            {
              textAlign: "center",
              font: "bold 14px sans-serif",
              stroke: "#1967B3",
              segmentIndex: 0,
              segmentOffset: new go.Point(NaN, NaN),
              segmentOrientation: go.Link.OrientUpright
            },
            new go.Binding("text", "text")),
          $(go.TextBlock,  // the "to" label
            {
              textAlign: "center",
              font: "bold 14px sans-serif",
              stroke: "#1967B3",
              segmentIndex: -1,
              segmentOffset: new go.Point(NaN, NaN),
              segmentOrientation: go.Link.OrientUpright
            },
            new go.Binding("text", "toText"))
        );

//       let nodeDataArray = [{key:"Record1", fields:[ {name:"field1", info:"", color:"#F7B84B", figure:"LineH"},
//                                                     {name:"field2", info:"the second one", color:"#F25022", figure:"Ellipse"},
//                                                     {name:"fieldThree", info:"3rd", color:"#00BCF2"} ], loc: '0,0'},
//                             {key:"Record2", fields:[ {name:"fieldA", info:"", color:"#FFB900", figure:"Diamond"},
//                                                     {name:"fieldB", info:"", color:"#F25022", figure:"Rectangle"},
//                                                     {name:"fieldC", info:"", color:"#7FBA00", figure:"Diamond"},
//                                                     {name:"fieldD", info:"fourth", color:"#00BCF2", figure:"Rectangle"} ], loc: '1000,1000'}
// ];
//       let linkDataArray = [{from:"Record1", fromPort:"field1", to:"Record2", toPort:"fieldA"},
//                             {from:"Record1", fromPort:"field2", to:"Record2", toPort:"fieldD"},
//                             {from:"Record1", fromPort:"fieldThree", to:"Record2", toPort:"fieldB"}
//                             ];


          myDiagram.model = $(go.GraphLinksModel,
            {
                  linkFromPortIdProperty: "fromPort",
                  linkToPortIdProperty: "toPort",
              copiesArrays: true,
              copiesArrayObjects: true,
              nodeDataArray: nodes,
              linkDataArray: relationItems

            });



        let createZoomSlider = function () {
            new ZoomSlider(myDiagram, {
                orientation: 'horizontal',
                alignment: go.Spot.TopRight,
                alignmentFocus: go.Spot.TopRight,
                size: 250})
        }

        if (document.getElementsByClassName('zoomSlider').length === 0) {
            createZoomSlider()
        }
        else {
            document.getElementsByClassName('zoomSlider').item(0).remove()
            createZoomSlider()
        }
      // document.getElementById("downloadImgButton").addEventListener("click", makeBlob);
       let downloadImgButton = document.getElementById("downloadImgButton")
        downloadImgButton.onclick = function makeBlob() {
              let blob = myDiagram.makeImageData({  background: "white",
                                                    returnType: "blob",
                                                    callback: myCallback,
                                                    size: new go.Size(5000,5000),
                                                    maxSize: new go.Size(5000,5000)
                                                });
                        }

	// Re-assign nodes locations
    let relocateNodes = function () {
        let prevDiagram = go.Diagram.fromDiv('myDiagramDiv');
        if (prevDiagram !== null) {
            let locArray = prevDiagram.model['Fc'];
            for (let x of locArray) {
                for (let y of nodes) {
                    if (x.key === y.key) {
                        y.loc = x.loc;
                    }
                }
            }
        }
    }

	// Save config objects in sessionStorage
    let saveSession = function () {
        sessionStorage.setItem('nodes', JSON.stringify(nodes));
        sessionStorage.setItem('relations', JSON.stringify(relationItems));
    }

    myDiagram.addDiagramListener("SelectionMoved", init);
    myDiagram.addDiagramListener("SelectionMoved", relocateNodes);
    myDiagram.addDiagramListener("SelectionMoved", saveSession);

    }

    function myCallback(blob) {
      // When the blob is complete, make an anchor tag for it and use the tag to initiate a download

      let url = window.URL.createObjectURL(blob);
      let filename = "ERD_Image.jpeg";

      let a = document.createElement("a");
      a.style = "display: none";
      a.href = url;
      a.download = filename;

      // IE 11
      if (window.navigator.msSaveBlob !== undefined) {
        window.navigator.msSaveBlob(blob, filename);
        return;
      }

      document.body.appendChild(a);
      requestAnimationFrame(function() {
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    }

    window.addEventListener('DOMContentLoaded', init);

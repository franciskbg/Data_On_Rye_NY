var html = "<div><b>Resizable Control</h5></b><p>Here is some text. cubilia Curae</p></div>";
        
var resizablebottomright = new L.ResizableControl({
    position: 'bottomright',
    minimizedHeight: 60,
    minimizedWidth: 0.1,
    enlargedHeight: 0.6,
    enlargedWidth: 0.4,
    enlargeCallback: function(e) {},
    minimizeCallback: function(e) {},
    contentClassName: "resizable-control-content",
    scrollPaneClassName: "resizable-control-scrollpane",
    className: "resizable-control-container",
    jscrollpane: true,
    appendOnAdd: function(divElement) {}
});

map.addControl(resizablebottomright);
resizablebottomright.setContent(html);
 
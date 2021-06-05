!function(e){"function"==typeof define&&define.amd?define(e):e()}(function(){AFRAME.registerComponent("portal",{schema:{destSelector:{default:""},width:{default:2},height:{default:3},maxRecursion:{default:2}},init:function(){var e=this.el,t=e.sceneEl,n=this.data;e.justTeleported=!1;var r=new THREE.BoxBufferGeometry(n.width,n.height,.01),o=new THREE.MeshBasicMaterial({colorWrite:!1}),a=new THREE.Mesh(r,o);if(a.geometry.computeBoundingSphere(),a.frustumCulled=!0,a.matrixAutoUpdate=!1,a.renderOrder=2,a.visible=!0,a.name="portal-surface",e.object3D.add(a),t.addEventListener("portal-teleported",function(){e.justTeleported=!0}),e.addEventListener("camera-collision",function(){if(!0!==e.justTeleported){e.justTeleported=!0,t.emit("portal-teleported");var r=t.camera,o=r.el,a=document.querySelector(n.destSelector).object3D,i=e.object3D.rotation,l=a.rotation,c=new THREE.Euler(i.x-l.x,i.y-l.y,i.z-l.z);o.components["look-controls"]&&(o.components["look-controls"].yawObject.rotation.y+=c.y);var s=new THREE.Vector3;s.subVectors(r.getWorldPosition(new THREE.Vector3),e.object3D.getWorldPosition(new THREE.Vector3));var E=a.position.clone().add(s);r.el.object3D.position.x=E.x,r.el.object3D.position.y=E.y,r.el.object3D.position.z=E.z}}),t.portals||(t.portals=[],t.portalPairs=[]),!1===Array.from(t.children).reduce(function(e,t){return e||t.hasAttribute("portal-manager")},!1)){var i=document.createElement("a-entity");i.setAttribute("portal-manager",{maxRecursion:n.maxRecursion}),t.appendChild(i)}var l=t.portalPairs;t.portals.push(e.object3D);var c=document.querySelector(n.destSelector);if(c){var s=!1;l.forEach(function(t){t.forEach(function(t){t==e.object3D&&(s=!0)})}),0==s&&l.push([e.object3D,c.object3D])}},tick:function(){var e=this.el;!0===e.justTeleported&&setTimeout(function(){e.justTeleported=!1},100)}}),AFRAME.registerComponent("portal-manager",{schema:{maxRecursion:{default:2}},init:function(){},tick:function(){var e=this.el.sceneEl,t=e.camera,n=e.portals.map(function(e){var t=e.children.filter(function(e){return"portal-surface"==e.name})[0],n=(new THREE.Box3).setFromObject(t);return{portal:e,xMin:n.min.x,xMax:n.max.x,yMin:n.min.y,yMax:n.max.y,zMin:n.min.z,zMax:n.max.z}}),r=t.getWorldPosition(new THREE.Vector3),o=r.x-.05,a=r.x+.05,i=r.y-.05,l=r.y+.05,c=r.z-.05,s=r.z+.05;n.forEach(function(e){o<=e.xMax&&a>=e.xMin&&i<=e.yMax&&l>=e.yMin&&c<=e.zMax&&s>=e.zMin&&(console.log("collision!"),e.portal.el.emit("camera-collision"))})},tock:function(){this.renderRecursivePortals(this.el.sceneEl.renderer,this.el.sceneEl.camera,0)},renderRecursivePortals:function(e,t,n){var r=this,o=this.el.sceneEl,a=o.portals,i=o.portalPairs,l=e.getContext();e.autoClear=!1,t.matrixAutoUpdate=!1,i.forEach(function(i){i.forEach(function(c,s){var E=i[1-s],d=new THREE.Scene;d.children=c.children,l.colorMask(!1,!1,!1,!1),l.depthMask(!1),l.disable(l.DEPTH_TEST),l.enable(l.STENCIL_TEST),l.stencilFunc(l.NOTEQUAL,n,255),l.stencilOp(l.INCR,l.KEEP,l.KEEP),l.stencilMask(255),e.render(d,t);var u=(new THREE.PerspectiveCamera).copy(t);if(u.matrixWorld=function(e,t,n){var r=e.matrixWorld.clone();r.invert().multiply(t.matrixWorld);var o=n.matrixWorld.clone().invert(),a=(new THREE.Matrix4).makeRotationY(Math.PI);return(new THREE.Matrix4).multiply(r).multiply(a).multiply(o).invert()}(t,c,E),u.projectionMatrix=function(e,t,n){var r=t.clone().invert(),o=(new THREE.Matrix4).extractRotation(e.matrixWorld),a=(new THREE.Vector3).set(0,0,1).applyMatrix4(o),i=new THREE.Plane;i.setFromNormalAndCoplanarPoint(a,e.getWorldPosition(new THREE.Vector3)),i.applyMatrix4(r);var l=new THREE.Vector4;l.set(i.normal.x,i.normal.y,i.normal.z,i.constant);var c=n.clone(),s=new THREE.Vector4;return s.x=(Math.sign(l.x)+c.elements[8])/c.elements[0],s.y=(Math.sign(l.y)+c.elements[9])/c.elements[5],s.z=-1,s.w=(1+c.elements[10])/n.elements[14],l.multiplyScalar(2/l.dot(s)),c.elements[2]=l.x,c.elements[6]=l.y,c.elements[10]=l.z+1,c.elements[14]=l.w,c}(E,u.matrixWorld,u.projectionMatrix),n==r.data.maxRecursion){l.colorMask(!0,!0,!0,!0),l.depthMask(!0),e.clear(!1,!0,!1),l.enable(l.DEPTH_TEST),l.enable(l.STENCIL_TEST),l.stencilMask(0),l.stencilFunc(l.EQUAL,n+1,255),(new THREE.Scene).children=o.object3D.children.filter(function(e){return!a.includes(e)});var m=new THREE.Scene;m.children=o.object3D.children,e.render(m,u)}else r.renderRecursivePortals(e,u,n+1);l.colorMask(!1,!1,!1,!1),l.depthMask(!1),l.enable(l.STENCIL_TEST),l.stencilMask(255),l.stencilFunc(l.NOTEQUAL,n+1,255),l.stencilOp(l.DECR,l.KEEP,l.KEEP),e.render(d,t)})}),l.disable(l.STENCIL_TEST),l.stencilMask(0),l.colorMask(!1,!1,!1,!1),l.enable(l.DEPTH_TEST),l.depthMask(!0),l.depthFunc(l.ALWAYS),e.clear(!1,!0,!1),a.forEach(function(n){var r=new THREE.Scene;r.children=n.children,e.render(r,t)}),l.depthFunc(l.LESS),l.enable(l.STENCIL_TEST),l.stencilMask(0),l.stencilFunc(l.LEQUAL,n,255),l.colorMask(!0,!0,!0,!0),l.depthMask(!0),(new THREE.Scene).children=o.object3D.children;var c=new THREE.Scene;c.children=o.object3D.children,e.render(c,t),t.matrixAutoUpdate=!0}})});
//# sourceMappingURL=aframe-portals.umd.js.map

const fs = require('fs');
const path = require('path');
const { getViewScripts } = require('./views-scripts');

const renderConfigPage = (protocol, host, query, manifest) => {
   // Verifica se il file addon-config.json esiste
   const configPath = path.join(__dirname, 'addon-config.json');
   const m3uDefaultUrl = 'https://github.com/mccoy88f/OMG-Premium-TV/blob/main/tv.png?raw=true';
   const m3uIsDisabled = !fs.existsSync(configPath);

   return `
       <!DOCTYPE html>
       <html>
       <head>
           <meta charset="utf-8">
           <title>${manifest.name}</title>
           <style>
               body {
                   margin: 0;
                   padding: 0;
                   height: 100vh;
                   overflow-y: auto;
                   font-family: Arial, sans-serif;
                   color: #fff;
                   background: purple;
               }
               #background-video {
                   position: fixed;
                   right: 0;
                   bottom: 0;
                   min-width: 100%;
                   min-height: 100%;
                   width: auto;
                   height: auto;
                   z-index: -1000;
                   background: black;
                   object-fit: cover;
                   filter: blur(5px) brightness(0.5);
               }
               .content {
                   position: relative;
                   z-index: 1;
                   max-width: 800px;
                   margin: 0 auto;
                   text-align: center;
                   padding: 50px 20px;
                   background: rgba(0,0,0,0.6);
                   min-height: 100vh;
                   display: flex;
                   flex-direction: column;
                   justify-content: flex-start;
                   overflow-y: visible;
               }

               .logo {
                   width: 150px;
                   margin: 0 auto 20px;
                   display: block;
               }
               .manifest-url {
                   background: rgba(255,255,255,0.1);
                   padding: 10px;
                   border-radius: 4px;
                   word-break: break-all;
                   margin: 20px 0;
                   font-size: 12px;
               }

               .loader-overlay {
                   position: fixed;
                   top: 0;
                   left: 0;
                   width: 100%;
                   height: 100%;
                   background: rgba(0,0,0,0.8);
                   display: none;
                   justify-content: center;
                   align-items: center;
                   z-index: 2000;
                   flex-direction: column;
               }
               
               .loader {
                   border: 6px solid #3d2a56;
                   border-radius: 50%;
                   border-top: 6px solid #8A5AAB;
                   width: 50px;
                   height: 50px;
                   animation: spin 1s linear infinite;
                   margin-bottom: 20px;
               }
               
               .loader-message {
                   color: white;
                   font-size: 18px;
                   text-align: center;
                   max-width: 80%;
               }
               
               @keyframes spin {
                   0% { transform: rotate(0deg); }
                   100% { transform: rotate(360deg); }
               }
               
               .config-form {
                   text-align: left;
                   background: rgba(255,255,255,0.1);
                   padding: 20px;
                   border-radius: 4px;
                   margin-top: 30px;
               }
               .config-form label {
                   display: block;
                   margin: 10px 0 5px;
                   color: #fff;
               }
               .config-form input, .config-form select {
                   width: 100%;
                   padding: 8px;
                   margin-bottom: 10px;
                   border: none;
                   border-radius: 4px;
                   background: rgba(255,255,255,0.1);
                   color: #fff;
                   border: 1px solid #666;
               }
               .config-form input:focus, .config-form select:focus {
                   outline: none;
                   border-color: #8A5AAB;
               }
               .config-form button {
                   background: #8A5AAB;
                   color: white;
                   border: none;
                   padding: 12px 20px;
                   border-radius: 4px;
                   cursor: pointer;
                   margin: 5px;
                   font-size: 16px;
               }
               .config-form button:hover {
                   background: #6b2a8a;
               }
               .buttons {
                   margin: 20px 0;
               }
               .buttons button {
                   background: #8A5AAB;
                   color: white;
                   border: none;
                   padding: 15px 25px;
                   border-radius: 4px;
                   cursor: pointer;
                   margin: 5px;
                   font-size: 16px;
                   font-weight: bold;
               }
               .buttons button:hover {
                   background: #6b2a8a;
               }
               .toast {
                   position: fixed;
                   bottom: 20px;
                   right: 20px;
                   background: #4CAF50;
                   color: white;
                   padding: 15px;
                   border-radius: 4px;
                   display: none;
                   z-index: 1001;
               }
               .advanced-settings {
                   background: rgba(255,255,255,0.05);
                   border: 1px solid #666;
                   border-radius: 4px;
                   padding: 10px;
                   margin-top: 10px;
               }
               .advanced-settings-header {
                   cursor: pointer;
                   display: flex;
                   justify-content: space-between;
                   align-items: center;
                   color: #fff;
               }
               .advanced-settings-content {
                   display: none;
                   padding-top: 10px;
               }
               .advanced-settings-content.show {
                   display: block;
               }
               #confirmModal {
                   display: none;
                   position: fixed;
                   top: 0;
                   left: 0;
                   width: 100%;
                   height: 100%;
                   background: rgba(0,0,0,0.8);
                   z-index: 1000;
                   justify-content: center;
                   align-items: center;
               }
               #confirmModal > div {
                   background: #333;
                   padding: 30px;
                   border-radius: 10px;
                   text-align: center;
                   color: white;
               }
               #confirmModal button {
                   margin: 0 10px;
               }
               a {
                   color: #8A5AAB;
                   text-decoration: none;
               }
               a:hover {
                   text-decoration: underline;
               }
           </style>
       </head>
       <body>
           <video autoplay loop muted id="background-video">
               <source src="https://static.vecteezy.com/system/resources/previews/001/803/236/mp4/no-signal-bad-tv-free-video.mp4" type="video/mp4">
               Your browser does not support the video tag.
           </video>

           <div class="content">
               <img class="logo" src="${manifest.logo}" alt="logo">
               <h1>${manifest.name} <span style="font-size: 16px; color: #aaa;">v${manifest.version}</span></h1>

               
               <div class="manifest-url">
                   <strong>Manifest URL:</strong><br>
                   ${protocol}://${host}/manifest.json?${new URLSearchParams(query)}
               </div>

               <div class="buttons">
                   <button onclick="copyManifestUrl()">COPY MANIFEST URL</button>
                   <button onclick="installAddon()">INSTALL ON STREMIO</button>
               </div>
               
               <div class="config-form">
                   <h2>Generate Configuration</h2>
                   <form id="configForm" onsubmit="updateConfig(event)">
                       <label>M3U URL:</label>
                       <input type="url" name="m3u" 
                              value="${m3uIsDisabled ? '' : query.m3u || ''}" 
                              placeholder="Enter your M3U/M3U8 playlist URL" 
                              ${m3uIsDisabled ? 'required' : ''}>

                       <label>EPG URL:</label>
                       <input type="url" name="epg" 
                              value="${query.epg || ''}" 
                              placeholder="Enter your EPG XML URL (optional)">

                       <label>
                           <input type="checkbox" name="epg_enabled" 
                                  ${query.epg_enabled === 'true' ? 'checked' : ''}> 
                           Enable EPG
                       </label>

                       <div class="advanced-settings">
                           <div class="advanced-settings-header" onclick="toggleAdvancedSettings()">
                               <span>Advanced Settings</span>
                               <span id="advanced-settings-toggle">▼</span>
                           </div>
                           <div id="advanced-settings-content" class="advanced-settings-content">
                               <label>Proxy URL:</label>
                               <input type="url" name="proxy_url" 
                                      value="${query.proxy_url || ''}" 
                                      placeholder="MediaFlow Proxy URL (optional)">

                               <label>Proxy Password:</label>
                               <input type="password" name="proxy_password" 
                                      value="${query.proxy_password || ''}" 
                                      placeholder="Proxy password (if required)">

                               <label>
                                   <input type="checkbox" name="force_proxy" 
                                          ${query.force_proxy === 'true' ? 'checked' : ''}> 
                                   Force Proxy
                               </label>

                               <label>ID Suffix:</label>
                               <input type="text" name="id_suffix" 
                                      value="${query.id_suffix || ''}" 
                                      placeholder="e.g., .it">

                               <label>Remapper File Path:</label>
                               <input type="text" name="remapper_file" 
                                      value="${query.remapper_file || ''}" 
                                      placeholder="Path to remapper file">

                               <label>Update Interval (HH:MM):</label>
                               <input type="text" name="update_interval" 
                                      value="${query.update_interval || ''}" 
                                      placeholder="e.g., 06:00" 
                                      pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$">
                           </div>
                       </div>

                       <div class="advanced-settings">
                           <div class="advanced-settings-header" onclick="togglePythonSection()">
                               <span>Python Script Generation</span>
                               <span id="python-section-toggle">▼</span>
                           </div>
                           <div id="python-section-content" class="advanced-settings-content">
                               <label>Python Script URL:</label>
                               <input type="url" name="python_script_url" 
                                      value="${query.python_script_url || ''}" 
                                      placeholder="URL of Python script for playlist generation">

                               <div style="display: flex; gap: 10px; margin: 10px 0;">
                                   <button type="button" onclick="downloadPythonScript()">DOWNLOAD SCRIPT</button>
                                   <button type="button" onclick="runPythonScript()">RUN SCRIPT</button>
                                   <button type="button" onclick="checkPythonStatus()">CHECK STATUS</button>
                               </div>

                               <div id="pythonStatus" style="display: none; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 4px; margin-top: 10px;">
                                   <h4>Python Script Status</h4>
                                   <div id="pythonStatusContent"></div>
                               </div>
                           </div>
                       </div>

                       <div class="advanced-settings">
                           <div class="advanced-settings-header" onclick="toggleResolverSection()">
                               <span>Python Resolver Settings</span>
                               <span id="resolver-section-toggle">▼</span>
                           </div>
                           <div id="resolver-section-content" class="advanced-settings-content">
                               <label>
                                   <input type="checkbox" name="resolver_enabled" 
                                          ${query.resolver_enabled === 'true' ? 'checked' : ''}> 
                                   Enable Python Resolver
                               </label>

                               <label>Resolver Script URL:</label>
                               <input type="url" name="resolver_script_url" 
                                      value="${query.resolver_script_url || ''}" 
                                      placeholder="URL of Python resolver script">

                               <label>Resolver Update Interval (HH:MM):</label>
                               <input type="text" name="resolver_update_interval" 
                                      value="${query.resolver_update_interval || ''}" 
                                      placeholder="e.g., 24:00" 
                                      pattern="^([0-9][0-9]|[1-9]):[0-5][0-9]$">

                               <div style="display: flex; gap: 10px; margin: 10px 0;">
                                   <button type="button" onclick="downloadResolverScript()">DOWNLOAD RESOLVER</button>
                                   <button type="button" onclick="createResolverTemplate()">CREATE TEMPLATE</button>
                               </div>
                           </div>
                       </div>

                       <div style="margin-top: 20px;">
                           <button type="submit">GENERATE CONFIGURATION</button>
                           <button type="button" onclick="backupConfig()">BACKUP CONFIGURATION</button>
                           <input type="file" id="restoreFile" accept=".json" style="display: none;" onchange="restoreConfig(event)">
                           <button type="button" onclick="document.getElementById('restoreFile').click()">RESTORE CONFIGURATION</button>
                       </div>
                   </form>
               </div>

               <div style="margin-top: 40px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                   <p style="margin-bottom: 15px;">If this addon has been useful to you, consider supporting its development! ❤️</p>
                   
                   <div style="text-align: center; margin: 20px 0;">
                       <a href="https://www.buymeacoffee.com/mccoy88f" target="_blank">
                           <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=mccoy88f&button_colour=FFDD00&font_colour=000000&font_family=Bree&outline_colour=000000&coffee_colour=ffffff" alt="Buy Me a Coffee" style="max-width: 300px; margin: 0 auto;"/>
                       </a>
                   </div>
                   
                   <p style="margin-top: 15px;">
                       <a href="https://paypal.me/mccoy88f?country.x=IT&locale.x=it_IT" target="_blank">You can also buy me a beer with PayPal 🍻</a>
                   </p>
                   
                   <div style="margin-top: 30px; background: rgba(255,255,255,0.1); padding: 15px; border-radius: 4px;">
                       <strong>WARNING!</strong>
                       <ul style="text-align: center; margin-top: 10px;">
                           <p>I am not responsible for the illicit use of the addon.</p>
                           <p>Check and comply with the current regulations in your country!</p>
                       </ul>
                   </div>
               </div>
               
               <div id="confirmModal">
                   <div>
                       <h2>Confirm Installation</h2>
                       <p>Have you already generated the configuration?</p>
                       <div style="margin-top: 20px;">
                           <button onclick="cancelInstallation()" style="background: #666;">Back</button>
                           <button onclick="proceedInstallation()" style="background: #8A5AAB;">Proceed</button>
                       </div>
                   </div>
               </div>
               
               <div id="toast" class="toast">URL Copied!</div>
               
               <script>
                   ${getViewScripts(protocol, host)}
               </script>
           </div>
           <div id="loaderOverlay" class="loader-overlay">
               <div class="loader"></div>
               <div id="loaderMessage" class="loader-message">Operation in progress...</div>
           </div>
       </body>
       </html>
   `;
};

module.exports = {
    renderConfigPage
};

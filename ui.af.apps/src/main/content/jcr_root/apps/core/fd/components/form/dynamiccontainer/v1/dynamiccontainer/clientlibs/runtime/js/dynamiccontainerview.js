/*******************************************************************************
 * Copyright 2024 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function () {

    class DynamicContainer extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormDynamicContainer";
        static bemBlock = 'cmp-adaptiveform-dynamiccontainer'
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            label: `.${DynamicContainer.bemBlock}__label`,
            description: `.${DynamicContainer.bemBlock}__longdescription`,
            qm: `.${DynamicContainer.bemBlock}__questionmark`,
            tooltipDiv: `.${DynamicContainer.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
        }

        getClass() {
            return DynamicContainer.IS;
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
        }

        getWidgetId(){
          return this.getId();
        }

        getWidget() {
            return null;
        }

        getDescription() {
            return this.element.querySelector(DynamicContainer.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(DynamicContainer.selectors.label);
        }

        getErrorDiv() {
            //error div is not defined
            return null;
        }

        getTooltipDiv() {
            return null;
        }

        getQuestionMarkDiv() {
            return null;
        }

        handleChildRemoval(removedInstanceView) {
            this.children.splice(this.children.indexOf(removedInstanceView), 1);
        }

        #getDynamicItemJson(url, callback) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        // If the request is successful (status code 200), pass the response to the callback function
                        callback(null, JSON.parse(xhr.responseText));
                    } else {
                        // If there's an error, pass the error information to the callback function
                        callback(new Error('Request failed with status: ' + xhr.status), null);
                    }
                }
            };
            xhr.open('GET', url, true);
            xhr.send();
        }

        #injectHTML(json) {
            // fetch html from html provider servlet
            let data = { "modelJSON" : JSON.stringify(json) };
            const params = new URLSearchParams(data).toString();
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this._model.properties['fd:path'] + '.af.generate.html?' + params, true);
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // Parse the JSON response
                    var response = xhr.responseText;
                    console.log(response);
                } else {
                    console.error('Request failed with status:', xhr.status);
                }
            };

            xhr.send();
        }

        async setModel(model) {
            super.setModel(model);
            let formModel = guideBridge.getFormModel();
            let jsonModel = await new Promise((resolve, reject) => {
                this.#getDynamicItemJson(this._model._jsonModel.dataModelRef, function (error, response) {
                    if (error) {
                        console.error('Error:', error);
                        reject(error);
                    } else {
                        console.log('Response:', response);
                        resolve(response);
                    }
                });
            })
            formModel.importModel(this._model, jsonModel);
            await this.#injectHTML(jsonModel);
        }

        updateAppendDynamicItems(a, b){
            a.items.forEach(item => {
                super.addChild(item);
            })
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new DynamicContainer({element, formContainer})
    }, DynamicContainer.selectors.self);
})();

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

        updateAppendDynamicItems(){
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new DynamicContainer({element, formContainer})
    }, DynamicContainer.selectors.self);
})();

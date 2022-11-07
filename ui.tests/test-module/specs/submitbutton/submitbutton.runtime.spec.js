/*******************************************************************************
 * Copyright 2022 Adobe
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
describe("Form with Submit Button", () => {

    const pagePath = "content/forms/af/core-components-it/samples/submitbutton/basic.html"
    const bemBlock = 'cmp-submitbutton'
    const IS = "adaptiveFormSubmitButton"
    const selectors = {
        submitbutton : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it("should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });
    })

    it("Clicking the button should submit the form", () => {
        const [id1, fieldView1] = Object.entries(formContainer._fields)[0] // Textbox
        const [id2, fieldView2] = Object.entries(formContainer._fields)[1] // Submit button
        const input = "Sample Text";
        cy.get(`#${id1}`).find('input').type(input)
        cy.get(`#${id2}`).click().then(x => {
            cy.get('body').should('have.text', "Thank you for submitting the form.\n")
        })
    });

})
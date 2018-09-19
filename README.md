# Simple Modal

## Description

A simple modal.

## Props

* backgroundShade (string/optional) - The shade of color (dark/light) to use for the modal background.
* closeButtonStyle (object/optional) - Extra style to apply to the close button.
* onClose (func/required) - Function to run when the modal is closed.
* onOpen (func/optional) - Function to invoke when the modal is opened.
* isVisible (bool/required) - Is this modal visible or not?
* onEscapeKey (func/optional) - Function to run when escape key is pressed.

## Usage

```javascript
import React from "react"
import SimpleModal from "@alexseitsinger/simple-modal"
import {connect} from "react-redux"
import {setModalVisible} from "../actions/example"
import style from "./style.css"

class ExampleApp extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        modalVisible: PropTypes.bool.isRequired
    }
    render() {
        const {
            dispatch,
            modalVisible
        } = this.props
        return (
            <div className={style.container}>
                <button className={style.openModalButton}
                        onClick={() => {
                            dispatch(setModalVisible(true))
                        }}>
                    Open Modal
                </button>
                <SimpleModal isVisible={modalVisible}
                             backgroundShade={"dark"}
                             onOpen={() => {
                                // Do something fun here.
                             }}
                             onClose={() => {
                                dispatch(setModalVisible(false))
                             }}
                             onEscapeKey={() => {
                                dispatch(setModalVisible(false))
                             }}
                             closeButtonStyle={{
                                backgroundColor: "#FFEE00",
                                color: "#FFFFFF",
                             }}>
                    <div>This is in the modal window</div>
                </SimpleModal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        modalVisible: state.example.modalVisible,
    }
}

export default connect(mapStateToProps)(ExampleApp)
export {ExampleApp as ExampleAppNotConnected}
```
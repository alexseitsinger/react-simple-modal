import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import classNames from "classnames"
import _ from "underscore"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTimes} from "@fortawesome/free-solid-svg-icons"
import {debounce} from "debounce"
import styled, {css} from "styled-components"

const Modal = styled.div`
    position: absolute;
    min-height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
`

const ModalForeground = styled.div`
    z-index: 4;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
`

const ModalBackground = styled.div`
    position: absolute;
    width: 100%;
    min-height: 100%;
    z-index: 3;
    ${props => (props.backgroundShade === "dark") && css`
        background-color: rgba(22, 22, 22, 0.5);
    `}
    ${props => (props.backgroundShade === "light") && css`
        background-color: rgba(255, 255, 255, 0.5);
    `}
`

const ModalCloseButton = styled.button`
    position: fixed;
    top: 0;
    right: 0;
    z-index: 2;
    margin-right: 1.5rem;
    margin-top: 1.5rem;
    ${props => (props.backgroundShade == "dark") && css`
        color: #EEE;
    `}
    ${props => (props.backgroundShade == "light") && css`
        color: #222;
    `}
`
const ModalWindow = styled.div`
    height: 100%;
    width: 100%;
`

const ModalWindowContent = styled.div`
`

const fixedEl = {
    position: "fixed",
    width: "100%"
}

function applyStyle(element, style) {
    for(var key in style){
        if(style.hasOwnProperty(key)){
            var value = style[key]
            element.style[key] = value
        }
    }
}

function isPositionFixed(el){
    if(el.style &&
       el.style.position &&
       el.style.position === "fixed"){
        return true
    }
    return false
}

function removeStyle(element, style) {
    for(var key in style){
        if(style.hasOwnProperty(key)){
            element.style.removeProperty(key)
        }
    }
}


class SimpleModal extends React.Component {
    static propTypes = {
        backgroundShade: PropTypes.string,
        closeButtonStyle: PropTypes.object,
        onClose: PropTypes.func.isRequired,
        onOpen: PropTypes.func,
        isVisible: PropTypes.bool.isRequired,
        onEscapeKey: PropTypes.func
    };

    constructor(props){
        super(props)
        // A variable for our REF to the container element of the modal.
        this.SELF = null
    }

    // When the document has a keydown event, debounce the event until the last
    // one. Then, check if it's the ESC key. If it is, check if we got a prop
    // called onEscapeKey, and invoke it if so.
    _handleDocumentKeyDown = debounce((event) => {
        const key = event.which
        const ESCAPE_KEY_CODE = 27
        if(key === ESCAPE_KEY_CODE){
            const onEscapeKey = this.props.onEscapeKey
            if(_.isFunction(onEscapeKey)){
                onEscapeKey()
            }
        }
    }, 500);

    _attachDocumentKeyDownListener = () => {
        if(typeof document == "undefined"){ return }
        document.addEventListener("keydown", this._handleDocumentKeyDown, false)
    };

    _detachDocumentKeyDownListener = () => {
        if(typeof document == "undefined"){ return }
        document.removeEventListener("keydown", this._handleDocumentKeyDown, false)
    };

    componentWillUnmount() {
        // When the component unmounts, remove the event listener we attached
        // for the ESC key.
        this._detachDocumentKeyDownListener()
    }

    componentDidMount() {
        // When the component mounts, attach an event listener to listen for
        // keydown events for the ESC key.
        this._attachDocumentKeyDownListener()
    }

    // Return a list of elements that have the classname "modal". Exclude any
    // elements that match the element provided as "self" argument.
    _getOtherModals = (self) => {
        if(typeof document == "undefined"){ return }
        // Get all the elements on the page with the classname modal.
        const otherModals = [].slice.call(document.getElementsByClassName("modal"))
        // If we got ourselves as an argument, rmeove it from the list of
        // elements we return.
        if(self){
            return otherModals.filter((el) => {
                return (el !== self)
            })
        }
        // Otherwise, return them all.
        return otherModals
    };

    // Apply the fixed style to each modal in the list so its removed from the
    // scrollable area of the browser.
    _unfixScrollingForOtherModals = (self) => {
        // For each other modal, excluding ourselves...
        this._getOtherModals(self).forEach((otherModal) => {
            setTimeout(() => {
                // Remove the fixed element styles from each.
                removeStyle(otherModal, fixedEl)
            })
        })
    };

    // If the main element is fixed, record its top position. Then, remove the
    // fixed element style from it to add it back to the scrollable content area.
    // Then, apply the top position as 0 to reset its position within the scrollable
    // area. Then, automatically scroll the window to the top position first recorded.
    unfixScrolling = (self) => {
        if(typeof document == "undefined"){ return }
        var mainEl = document.getElementsByTagName("main")[0]
        if(isPositionFixed(mainEl)){
            // Record the current top position of the main element.
            // NOTE: Must be before everything else to capture the top position offset.)
            var previousTopPosition = Math.abs(Number.parseInt(mainEl.style.top))
            // Remove the styles for the fixed els.
            removeStyle(mainEl, fixedEl)
            // Apply the style for top position reset.
            applyStyle(mainEl, {
                "top": "0px",
            })
            // Force the window to re-scroll to the original position.
            // NOTE: Must be the last thing to run in order to reset scrolling.
            if(typeof window === "undefined"){ return }
            window.scrollTo(0, previousTopPosition)
        }
        // Remove fixed styles on all other modals, excluding ourselves.
        this._unfixScrollingForOtherModals(self)
    };

    // Apply position fixed to each modal in the list, if they dont have it already.
    // This removes the modal from the scrollable area in the browser.
    _fixScrollingForOtherModals = (self) => {
        // For each modal, excluding ourself...
        this._getOtherModals(self).forEach((otherModal) => {
            setTimeout(() => {
                // If its not fixed...
                if(!isPositionFixed(otherModal)){
                    // Apply the fixed element style to it.
                    applyStyle(otherModal, fixedEl)
                }
            }, 100)
        })
    };

    // If the main element is not fixed, record the yOffset, and then apply fixed
    // position to it to remove it from the scollable area. Then record the top
    // position of the main element, if it's greater than 0, move the main element
    // top offset to be the inverse of that number to make it match the scroll
    // position of the widnow before the modal opened.
    fixScrolling = (self) => {
        if(typeof document == "undefined"){ return }
        var mainEl = document.getElementsByTagName("main")[0]
        if(!isPositionFixed(mainEl)){
            if(typeof window == "undefined"){ return }
            // Record the window position before we fix the element.
            const yOffset = Math.abs(Number.parseInt(window.pageYOffset))
            // Fix the main element to remove scrolling.
            applyStyle(mainEl, fixedEl)
            // Get the top position of the main element.
            const topPosition = parseInt(mainEl.style.top)
            // If the top position is greater than 0, apply a top offset to
            // move it up when the modal is opened.
            if(!(topPosition > 0)){
                applyStyle(mainEl, {
                    top: ("-" + yOffset + "px")
                })
            }
        }
        this._fixScrollingForOtherModals(self)
    };

    render() {
        const {
            backgroundShade,
            onClose,
            closeButtonStyle,
            children,
            onOpen,
            isVisible,
        } = this.props
        const modal = (
            <Modal className={"modal"}
                   ref={el => this.SELF = el}>
                <ModalBackground backgroundShade={backgroundShade}/>
                <ModalForeground>
                    <ModalCloseButton backgroundShade={backgroundShade}
                                      style={closeButtonStyle}
                                      onClick={() => {
                                          this.unfixScrolling(this.SELF)
                                          if(_.isFunction(onClose)){
                                              onClose()
                                          }
                                      }}>
                        <FontAwesomeIcon icon={faTimes}
                                         size={"2x"}/>
                    </ModalCloseButton>
                    <ModalWindow>
                        <ModalWindowContent>
                            {children}
                        </ModalWindowContent>
                    </ModalWindow>
                </ModalForeground>
            </Modal>
        )
        // If the element is visible...
        if(isVisible) {
            // Fix scrolling for all elements except this one.
            this.fixScrolling(this.SELF)
            // If theres an open callback provided, invoke it now.
            if(_.isFunction(onOpen)){
                onOpen()
            }
            if(typeof document == "undefined"){ return null }
            // Then, create the portal element in the DOM, under the BODY.
            return ReactDOM.createPortal(modal, document.body)
        }
        else {
            // Remove fixed styles from all the elements.
            this.unfixScrolling()
            // Dont return any rendered element since its not visible.
            return null
        }
    }
}

export default SimpleModal
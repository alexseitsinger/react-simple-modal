import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import {debounce} from "debounce"
import SimpleModalActual from "./components/simple-modal-actual"
import {
    fixedElStyle,
    applyStyle,
    removeStyle,
    isPositionFixed,
} from "./utils"

class SimpleModal extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]).isRequired,
        backgroundShade: PropTypes.string,
        onClose: PropTypes.func.isRequired,
        closeButtonStyle: PropTypes.object,
        onOpen: PropTypes.func,
        isVisible: PropTypes.bool.isRequired,
        onEscapeKey: PropTypes.func
    };

    static defaultProps = {
        backgroundShade: "dark",
        closeButtonStyle: {},
        onOpen: () => {
            //...
        },
        onEscapeKey: () => {
            //...
        },
    };

    // When the document has a keydown event, debounce the event until the last
    // one. Then, check if it's the ESC key. If it is, check if we got a prop
    // called onEscapeKey, and invoke it if so.
    _handleDocumentKeyDown = debounce((event) => {
        const key = event.which
        const ESCAPE_KEY_CODE = 27
        if(key === ESCAPE_KEY_CODE){
            this.props.onEscapeKey()
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
    _getOtherModals = (modal) => {
        if(typeof document == "undefined"){ return }
        // Get all the elements on the page with the classname modal.
        const otherModals = [].slice.call(document.getElementsByClassName("modal"))
        // If we got ourselves as an argument, rmeove it from the list of
        // elements we return.
        if(modal){
            return otherModals.filter((el) => {
                return (el !== modal)
            })
        }
        // Otherwise, return them all.
        return otherModals
    };

    // Apply the fixed style to each modal in the list so its removed from the
    // scrollable area of the browser.
    _unfixScrollingForOtherModals = (modal) => {
        // For each other modal, excluding ourselves...
        this._getOtherModals(modal).forEach((otherModal) => {
            setTimeout(() => {
                // Remove the fixed element styles from each.
                removeStyle(otherModal, fixedElStyle)
            })
        })
    };

    // If the main element is fixed, record its top position. Then, remove the
    // fixed element style from it to add it back to the scrollable content area.
    // Then, apply the top position as 0 to reset its position within the scrollable
    // area. Then, automatically scroll the window to the top position first recorded.
    unfixScrolling = (modal) => {
        if(typeof document == "undefined"){ return }
        var mainEl = document.getElementsByTagName("main")[0]
        if(isPositionFixed(mainEl)){
            // Record the current top position of the main element.
            // NOTE: Must be before everything else to capture the top position offset.)
            var previousTopPosition = Math.abs(Number.parseInt(mainEl.style.top))
            // Remove the styles for the fixed els.
            removeStyle(mainEl, fixedElStyle)
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
        this._unfixScrollingForOtherModals(modal)
    };

    // Apply position fixed to each modal in the list, if they dont have it already.
    // This removes the modal from the scrollable area in the browser.
    _fixScrollingForOtherModals = (modal) => {
        // For each modal, excluding ourself...
        this._getOtherModals(modal).forEach((otherModal) => {
            setTimeout(() => {
                // If its not fixed...
                if(!isPositionFixed(otherModal)){
                    // Apply the fixed element style to it.
                    applyStyle(otherModal, fixedElStyle)
                }
            }, 100)
        })
    };

    // If the main element is not fixed, record the yOffset, and then apply fixed
    // position to it to remove it from the scollable area. Then record the top
    // position of the main element, if it's greater than 0, move the main element
    // top offset to be the inverse of that number to make it match the scroll
    // position of the widnow before the modal opened.
    fixScrolling = (modal) => {
        if(typeof document == "undefined"){ return }
        var mainEl = document.getElementsByTagName("main")[0]
        if(!isPositionFixed(mainEl)){
            if(typeof window == "undefined"){ return }
            // Record the window position before we fix the element.
            const yOffset = Math.abs(Number.parseInt(window.pageYOffset))
            // Fix the main element to remove scrolling.
            applyStyle(mainEl, fixedElStyle)
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
        this._fixScrollingForOtherModals(modal)
    };

    render() {
        const {
            children,
            isVisible,
            backgroundShade,
            onOpen,
            onClose,
            closeButtonStyle,
        } = this.props
        // If the element is visible...
        if(isVisible) {
            if(typeof document == "undefined"){ return null }
            // Then, create the portal element in the DOM, under the BODY.
            const modal = (
                <SimpleModalActual
                    onDidMount={(modal) => {
                        this.fixScrolling(modal)
                        onOpen()
                    }}
                    onWillUnmount={(modal) => {
                        this.unfixScrolling()
                    }}
                    onClickCloseButton={onClose}
                    closeButtonStyle={closeButtonStyle}
                    backgroundShade={backgroundShade}>
                    {children}
                </SimpleModalActual>
            )
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
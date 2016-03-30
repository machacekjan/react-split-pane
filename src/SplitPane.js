'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Pane from './Pane';
import Resizer from './Resizer';
import VendorPrefix from 'react-vendor-prefix';


export default React.createClass({

    propTypes: {
        primary: React.PropTypes.oneOf(['first', 'second']),
        split: React.PropTypes.oneOf(['vertical', 'horizontal'])
    },

    getInitialState() {
        return {
            active: false,
            resized: false
        };
    },


    getDefaultProps() {
        return {
            split: 'vertical',
            minSize: 0,
            primary: 'first'
        };
    },


    componentDidMount() {
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('resize', this.onResize);
        const ref = this.props.primary === 'first' ? this.refs.pane1 : this.refs.pane2;

        if (ref && !this.state.resized) {
            const node = ReactDOM.findDOMNode(ref);
            let width = 0;
            let height = 0;

            if (node.getBoundingClientRect) {
                width = node.getBoundingClientRect().width;
                height = node.getBoundingClientRect().height;
            }

            const size = this.props.split === 'vertical' ? width : height;
            this.paneSize = this.props.defaultSize || size;

            ref.setState({
                size: this.paneSize
            });
        }

        this.setState({
            maxSize: this.updateSplitPaneMaxSize()
        });
    },


    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('resize', this.onResize);
    },


    onMouseDown(event) {
        this.unFocus();
        let position = this.props.split === 'vertical' ? event.clientX : event.clientY;
        if (this.props.onDragStart) {
            this.props.onDragStart();
        }
        this.setState({
            active: true,
            position: position
        });
    },


    onMouseMove(event) {
        if (this.state.active) {
            this.unFocus();
            const ref = this.props.primary === 'first' ? this.refs.pane1 : this.refs.pane2;
            const size = this.paneSize;
            const current = this.props.split === 'vertical' ? event.clientX : event.clientY;
            const position = this.state.position;
            const newPosition = this.props.primary === 'first' ? (position - current) : (current - position);

            let newSize =  size - newPosition;

            this.setState({
                position: current,
                resized: true
            });

            if (newSize < this.props.minSize) {
                newSize = this.props.minSize;
            } else if (newSize > this.state.maxSize) {
                // TODO
                // newSize = this.state.maxSize;
            }

            if (this.props.onChange) {
              this.props.onChange(newSize);
            }
            this.paneSize = newSize;
            ref.setState({
                size: newSize
            });
        }
    },


    onMouseUp() {
        if (this.state.active) {
            if (this.props.onDragFinished) {
                this.props.onDragFinished();
            }
            this.setState({
                active: false
            });
        }
    },


    onResize() {
        if ( this.resizeTimeout ) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            this.setState({ maxSize: this.updateSplitPaneMaxSize() });
        }, 500);
    },


    updateSplitPaneMaxSize() {
        const ref = this.refs.splitPane;
        const node = ReactDOM.findDOMNode(ref);
        let newMaxSize = null;

        if (this.props.split === 'vertical') {
            newMaxSize = node.getBoundingClientRect().width;
        } else {
            newMaxSize = node.getBoundingClientRect().height
        }

        return newMaxSize;
    },

    unFocus() {
        if (document.selection) {
            document.selection.empty();
        } else {
            window.getSelection().removeAllRanges()
        }
    },


    merge: function (into, obj) {
        for (let attr in obj) {
            into[attr] = obj[attr];
        }
    },


    render() {

        const split = this.props.split;

        let style = {
            display: 'flex',
            flex: 1,
            position: 'relative',
            outline: 'none',
            overflow: 'hidden',
            MozUserSelect: 'text',
            WebkitUserSelect: 'text',
            msUserSelect: 'text',
            userSelect: 'text'
        };

        if (split === 'vertical') {
            this.merge(style, {
                flexDirection: 'row',
                height: '100%',
                position: 'absolute',
                left: 0,
                right: 0
            });
        } else {
            this.merge(style, {
                flexDirection: 'column',
                height: '100%',
                minHeight: '100%',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%'
            });
        }

        const children = this.props.children;
        const classes = ['SplitPane', this.props.className, split];
        const prefixed = VendorPrefix.prefix({styles: style});

        return (
            <div className={classes.join(' ')} style={prefixed.styles} ref="splitPane">
                <Pane ref="pane1" key="pane1" className="Pane1" split={split}>{children[0]}</Pane>
                <Resizer ref="resizer" key="resizer" onMouseDown={this.onMouseDown} split={split} />
                <Pane ref="pane2" key="pane2" className="Pane2" split={split}>{children[1]}</Pane>
            </div>
        );
    }
});

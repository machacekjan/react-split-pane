import React from 'react';
import SplitPane from '../lib/SplitPane';
import Resizer from '../lib/Resizer';
import asserter from './assertions/Asserter';



describe('Horizontal SplitPane', function () {

    describe('Defaults', function () {

        const splitPane = (
            <SplitPane split="horizontal">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should render the SplitPane', function () {
            asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should render the child panes', function () {
            asserter(splitPane).assertPaneContents(['one', 'two']);
        });


        it('should have horizontal orientation', function () {
            asserter(splitPane).assertOrientation('horizontal');
        });


        it('should contain a Resizer', function () {
            asserter(splitPane).assertContainsResizer();
        });
    });



    describe('With defaultSize property', function () {

        const splitPane = (
            <SplitPane split="horizontal" defaultSize={99} >
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should have correct height for the top Pane', function () {
            asserter(splitPane).assertPaneHeight('99px');
        });
    });

    describe('With primary property set to second', function () {

        const splitPane = (
            <SplitPane split="horizontal" defaultSize={99} primary="second">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );


        it('should have correct height for the bottom Pane', function () {
            asserter(splitPane).assertPaneHeight('99px', 'second');
        });
    });

    describe('Resizer move up and down', function () {

        const splitPane = (
            <SplitPane split="horizontal" defaultSize={200}>
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );

        const moveToRight = { y: 200 };

        it('after move down, the first pane should be larger then before', function () {
            asserter(splitPane, true).assertResizeByDragging(moveToRight, { height: '400px' });
        });

        const moveToLeft = { y: -120 };

        it('after move up, the first pane should be smaller then before', function () {
            asserter(splitPane, true).assertResizeByDragging(moveToLeft, { height: '80px' });
        });
    });

    describe('Resizer move up and down and primary prop is set to second', function () {

        const splitPane = (
            <SplitPane split="horizontal" defaultSize={400} primary="second">
                <div>one</div>
                <div>two</div>
            </SplitPane>
        );

        const moveToRight = { y: 160 };

        it('after move down, the second pane should be smaller then before', function () {
            asserter(splitPane, true).assertResizeByDragging(moveToRight, { height: '240px' });
        });

        const moveToLeft = { y: -111 };

        it('after move up, the second pane should be larger then before', function () {
            asserter(splitPane, true).assertResizeByDragging(moveToLeft, { height: '511px' });
        });
    });
});




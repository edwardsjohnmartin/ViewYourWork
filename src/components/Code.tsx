import MonacoEditor, {useMonaco } from '@monaco-editor/react';
import { useEffect, useState, useRef } from 'react';
import *  as monaco from 'monaco-editor';

import "../css/code.css"
import React from 'react';

export default function Code({codeStates, playback, setPlayback, task, edits, hoverHighlights, editorRef, height="65vh"}) {
    const [currentCodeState, setCurrentCodeState] = useState("") 

    const [lastState, setLastState] = useState(null);
    const monaco = useMonaco();

    // const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        // if (codeStates.length > 0) {
        //     editor.setValue(codeStates[playback])
        // }
    } 

    // useEffect(() => {
    //     if (editorRef.current && codeStates.length > 0) {
    //         setPlayback(0)
    //         editorRef.current.getModel().setValue(codeStates[0])
    //     }
    //     setLastState(0)
    // }, [codeStates, editorRef.current])

    // useEffect(() => {
    //     if (!editorRef.current) return;
    //     if (editorRef.current && codeStates.length > 0 && (playback - lastState) == 1) {
    //         const edit = edits.current[playback] 

    //         const startLoc = editorRef.current.getModel().getPositionAt(edit.insertText.length > 0 ? edit.location: edit.location)
    //         const endLoc = editorRef.current.getModel().getPositionAt(edit.insertText.length > 0 ? edit.location : edit.location + edit.deleteText.length)
    //         const editToApply = {
    //             forceMoveMarkers: edit.insertText.length > 0,
    //             range: {
    //                 startColumn: startLoc.column,
    //                 startLineNumber: startLoc.lineNumber,
    //                 endColumn: endLoc.column,
    //                 endLineNumber: endLoc.lineNumber, 
    //             }, 
    //             text: edit.insertText.length > 0 ? edit.insertText : ""
    //         }            
    //         editorRef.current.getModel().applyEdits([editToApply])
    //     }
    //     else if (editorRef.current && codeStates.length > 0 && (playback - lastState) == -1) {
    //         const edit = edits.current[playback+1] 

    //         const endLoc = editorRef.current.getModel().getPositionAt(edit.deleteText.length > 0 ? edit.location: edit.location)
    //         const startLoc = editorRef.current.getModel().getPositionAt(edit.deleteText.length > 0 ? edit.location : edit.location + edit.insertText.length)
    //         const editToApply = {
    //             forceMoveMarkers: edit.deleteText.length > 0,
    //             range: {
    //                 startColumn: startLoc.column,
    //                 startLineNumber: startLoc.lineNumber,
    //                 endColumn: endLoc.column,
    //                 endLineNumber: endLoc.lineNumber, 
    //             }, 
    //             text: edit.deleteText.length > 0 ? edit.deleteText : ""
    //         }            
    //         editorRef.current.getModel().applyEdits([editToApply])
    //     }
    //     else if (editorRef.current && codeStates.length > 0 && Math.abs(playback - lastState) > 1) {
    //         editorRef.current.getModel().setValue(codeStates[playback])
    //     }
    //     setLastState(playback)
    //     // setCurrentCodeState(codeStates[playback])
    // }, [playback])

    useEffect(() => {
    if (codeStates.length > 0) {
        setCurrentCodeState(codeStates[playback])
    }
    }, [codeStates, playback])

    useEffect(() => {
        if (edits && editorRef.current != null) {
            const lastEdit = edits.current[playback];
            const { lineNumber, column } = editorRef.current.getModel().getPositionAt(lastEdit.location);
            const endLocation = editorRef.current.getModel().getPositionAt(lastEdit.location + lastEdit.insertText.length);

            // console.log(lastEdit.location)
            // console.log(lastEdit.location + lastEdit.insertText.length)
            // console.log(lineNumber, column, endLocation["lineNumber"], endLocation["column"])

            const codeHighlights: Array<any> = []

            // console.log(hoverHighlights)

            hoverHighlights.forEach(highlight => {
                codeHighlights.push({
                    range: new monaco.Range(
                        highlight.startLineNumber,
                        highlight.startColumn,
                        highlight.endLineNumber,
                        highlight.endColumn
                    ),
                    options: {
                        isWholeLine: false,
                        className: "highlightHovered",
                        zIndex: 2
                    }
                })
            });
            const insertEvent = {
                range: new monaco.Range(
                    lineNumber,
                    column,
                    endLocation["lineNumber"],
                    endLocation["column"]
                ),
                options: {
                    isWholeLine: false,
                    // className: "bg-light-code-highlight-2 dark:bg-dark-code-highlight-2",
                    className: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-dark-code-highlight-2 opacity-90' :'bg-light-code-highlight-2',
                    zIndex: 1
                }
            }
            const deleteEvent = {
                range: new monaco.Range(
                    lineNumber,
                    column - 1,
                    lineNumber,
                    column
                ),
                options: {
                    isWholeLine: false,
                    className: "delete"
                }
            }
            const highlightRow = {
                range: new monaco.Range(
                    lineNumber,
                    0,
                    lineNumber,
                    0
                ),
                options: {
                    isWholeLine: true,
                    // className: "bg-dark-code-highlight-1 dark:bg-dark-code-highlight-1",
                    // marginClassName: "bg-light-code-highlight-1 dark:bg-dark-code-highlight-1"
                    className: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-dark-code-highlight-1 opacity-30' :'bg-light-code-highlight-1',
                    marginClassName: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-dark-code-highlight-1 opacity-30' :'bg-light-code-highlight-1',
// 
                }
            };
            const editEvent = lastEdit.insertText.length > 0 ? insertEvent : deleteEvent;
    
            editorRef.current.setValue(currentCodeState);
            // editorRef.current.revealPositionInCenter({ lineNumber: lineNumber, column: column });
            editorRef.current.revealLineInCenterIfOutsideViewport(lineNumber);
            adjustViewForBlockComments(lineNumber)
            // editorRef.current.revealPositionInCenterIfOutsideViewport({ lineNumber: lineNumber, column: column });

            const combinedHighlights = codeHighlights.concat([highlightRow, editEvent]);
            editorRef.current.deltaDecorations([], combinedHighlights);
        }
    }, [currentCodeState])

    // useEffect(() => {
        
    function hasTwoOccurrences(str, substring) {
        let firstIndex = str.indexOf(substring);
        if (firstIndex === -1) return false; 
      
        let secondIndex = str.indexOf(substring, firstIndex + 1);
        return secondIndex !== -1; 
    }

    const adjustViewForBlockComments = (editLine) => {
        if (!monaco || !editorRef.current) {
            return;
        }
        const editor = editorRef.current;
        const model = editor.getModel();
        if (!model) {
            return;
        } 

        const visibleRange = editor.getVisibleRanges()[0];
        if (!visibleRange) {
            return;
        }
        const range = visibleRange.endColumn - visibleRange.startColumn;

        const text = model.getValue();
        const lines = text.split("\n");
        
        for (let i = 0; i < lines.length; i++) {
            
            if (lines[i].includes("\"\"")) {
                const startLine = i;
                let endLine = startLine;
                
                for (let j = i; j < lines.length; j++) {
                    if ((j==i && hasTwoOccurrences(lines[j], "\"\"\""))) {
                        endLine = j;

                        break;
                    }
                    else if ((j!=i && lines[j].includes("\"\"\""))) {
                        endLine = j;
                        break;
                    }
                }
                
                if (startLine < visibleRange.startLineNumber-1 && endLine >= visibleRange.startLineNumber-1 && startLine + range > editLine) {
                    editor.revealLineNearTop(startLine);
                } else if (startLine < visibleRange.startLineNumber-1 && endLine >= visibleRange.startLineNumber-1) {
                    editor.revealLineNearTop(endLine + 1);
                }
                i = endLine + 1
            }
        }
    };
    
    //     const disposable = editor.onDidScrollChange(adjustViewForBlockComments);
    //     adjustViewForBlockComments();
    
    //     return () => disposable.dispose();
    //   }, [monaco]);

    var options = {
        automaticLayout: true,
        readOnly: true,
        minimap: { enabled: false },
        colorDecorators: true,
    }

    return (
        <div className="block min-w-full h-fit overflow-none border-solid border-2 border-gray-200 rounded-sm p-2 z-40">
            <div className="h-full w-full">
                <MonacoEditor
                    height={height}
                    defaultLanguage='python'
                    // value={""}
                    value={currentCodeState}
                    options={options}
                    onMount={handleEditorDidMount}
                    theme={ window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' :'vs' }
                />
            </div>
        </div>
    )

}
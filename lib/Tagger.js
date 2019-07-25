"use strict";
const React = require("react");
const PropTypes = require("prop-types");
const Tag = require("./Tag");
const Input = require("./Input");
const Suggestions = require("./Suggestions");

const KEYS = {
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8,
    UP_ARROW: 38,
    DOWN_ARROW: 40
};

const CLASS_NAMES = {
    root: "vs tagger",
    rootFocused: "vs tagger focused",
    selected: "selected",
    selectedTag: "tag",
    selectedTagName: "tag-title",
    search: "tag-entry",
    searchInput: "tag-input-wrapper",
    suggestions: "tag-choices",
    suggestionActive: "active",
    suggestionDisabled: "disabled"
};

class Tagger extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            query: "",
            focused: false,
            expandable: false,
            selectedIndex: -1,
            classNames: Object.assign({ }, CLASS_NAMES, this.props.classNames)
        }

        this.inputEventHandlers = {
            // Provide a no-op function to the input component to avoid warnings
            // <https://github.com/i-like-robots/react-tags/issues/135>
            // <https://github.com/facebook/react/issues/13835>
            onChange: () => { },
            onBlur: this.handleBlur.bind(this),
            onFocus: this.handleFocus.bind(this),
            onInput: this.handleInput.bind(this),
            onKeyDown: this.handleKeyDown.bind(this)
        }
    }

    componentWillReceiveProps(newProps)
    {
        this.setState({
            classNames: Object.assign({ }, CLASS_NAMES, newProps.classNames)
        });
    }

    handleInput(e)
    {
        const query = e.target.value;

        if (this.props.handleInputChange) {
            this.props.handleInputChange(query);
        }

        this.setState({ query });
    }

    handleKeyDown(e)
    {
        const { query, selectedIndex } = this.state;
        const { delimiters, delimiterChars } = this.props;

        // when one of the terminating keys is pressed, add current query to the tags.
        if (delimiters.indexOf(e.keyCode) > -1 || delimiterChars.indexOf(e.key) > -1) {
            if (query || selectedIndex > -1) {
                e.preventDefault();
            }

            this.handleDelimiter();
        }

        // when backspace key is pressed and query is blank, delete the last tag
        if (e.keyCode === KEYS.BACKSPACE && query.length === 0 && this.props.allowBackspace) {
            this.deleteTag(this.props.tags.length - 1);
        }

        if (e.keyCode === KEYS.UP_ARROW) {
            e.preventDefault();

            // if last item, cycle to the bottom
            if (selectedIndex <= 0) {
                this.setState({ selectedIndex: this.suggestions.state.options.length - 1 });
            } else {
                this.setState({ selectedIndex: selectedIndex - 1 });
            }
        }

        if (e.keyCode === KEYS.DOWN_ARROW) {
            e.preventDefault();

            this.setState({ selectedIndex: (selectedIndex + 1) % this.suggestions.state.options.length });
        }
    }

    handleDelimiter()
    {
        const { query, selectedIndex } = this.state;

        if (query.length >= this.props.minQueryLength) {
            // Check if the user typed in an existing suggestion.
            const match = this.suggestions.state.options.findIndex((suggestion) =>
            {
                return suggestion.name.search(new RegExp(`^${query}$`, "i")) === 0;
            });

            const index = selectedIndex === -1 ? match : selectedIndex;

            if (index > -1) {
                this.addTag(this.suggestions.state.options[index]);
            } else if (this.props.allowNew) {
                this.addTag({ name: query });
            }
        }
    }

    handleClick(e)
    {
        if (document.activeElement !== e.target && this.props.showInput) { this.input.input.focus(); }
    }

    handleBlur()
    {
        this.setState({ focused: false, selectedIndex: -1 })

        if (this.props.handleBlur) { this.props.handleBlur(); }
        if (this.props.addOnBlur) { this.handleDelimiter(); }
    }

    handleFocus()
    {
        this.setState({ focused: true });

        if (this.props.handleFocus) { this.props.handleFocus(); }
    }

    addTag(tag)
    {
        if (!tag.disabled
            && (typeof this.props.handleValidate !== "function"
                || this.props.handleValidate(tag)
            )
        ) {
            this.props.handleAddition(tag);
            // reset the state
            this.setState({ query: "", selectedIndex: -1 });
        }
    }

    deleteTag(index)
    {
        this.props.handleDelete(index);

        if (this.props.clearInputOnDelete && this.state.query !== "") {
            this.setState({ query: "" });
        }
    }

    render()
    {
        // !ATTN TODO: NOPE
        const listboxId = "tagger-listbox";

        const TagComponent = this.props.tagComponent || Tag;

        const tags = this.props.tags.map((tag, index) => (
            <TagComponent
                key={ index }
                tag={ tag }
                classNames={ this.state.classNames }
                onDelete={ this.deleteTag.bind(this, index) }
            />
        ));

        const expandable = this.state.focused && this.state.query.length >= this.props.minQueryLength;
        const classNames = [ this.state.classNames.root ];

        this.state.focused && classNames.push(this.state.classNames.rootFocused);

        let basicProps = Object.assign(
            {},
            this.props.disabled ? { disabled: true } : {},
            this.props.readOnly ? { readOnly: true } : {}
        );

        return (
            <div className={ classNames.join(" ") } onClick={ this.handleClick.bind(this) }>
                <div className={ this.state.classNames.selected } aria-live="polite" aria-relevant="additions removals">
                    { tags }
                </div>
                { this.props.showInput
                    ? <div className={ this.state.classNames.search }>
                        <Input { ...this.state }
                            inputAttributes={ this.props.inputAttributes }
                            inputEventHandlers={ this.inputEventHandlers }
                            ref={ (c) => { this.input = c } }
                            listboxId={ listboxId }
                            autofocus={ this.props.autofocus }
                            autoresize={ this.props.autoresize }
                            expandable={ expandable }
                            placeholder={ this.props.placeholder } />
                        <Suggestions { ...this.state }
                            ref={ (c) => { this.suggestions = c } }
                            listboxId={ listboxId }
                            expandable={ expandable }
                            suggestions={ this.props.suggestions }
                            suggestionsFilter={ this.props.suggestionsFilter }
                            addTag={ this.addTag.bind(this) }
                            maxSuggestionsLength={ this.props.maxSuggestionsLength } />
                    </div>
                    : null
                }
                { this.props.showButton
                    ? <a
                        { ...this.props.buttonAttributes }
                        { ...basicProps }
                        href="javascript:;"
                        onClick={ this.props.onButtonClick }
                    >
                        { this.props.buttonLabel }
                    </a>
                    : null
                }
            </div>
        );
    }
}

Tagger.defaultProps = {
    tags: [ ],
    disabled: false,
    readOnly: false,
    suggestions: [ ],
    suggestionsFilter: null,
    autofocus: true,
    autoresize: true,
    showInput: true,
    showButton: false,
    delimiters: [ KEYS.TAB, KEYS.ENTER ],
    delimiterChars: [ ],
    minQueryLength: 2,
    maxSuggestionsLength: 6,
    allowNew: false,
    allowBackspace: true,
    tagComponent: null,
    placeholder: "Enter Tag...",
    inputAttributes: { },
    buttonAttributes: { className: "button" },
    buttonLabel: "Add New...",
    addOnBlur: false,
    clearInputOnDelete: true,
    handleAddition: (tag) => {},
    handleDelete: (tag) => {}
}

Tagger.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.object),
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    placeholder: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.object),
    suggestionsFilter: PropTypes.func,
    autofocus: PropTypes.bool,
    autoresize: PropTypes.bool,
    showInput: PropTypes.bool,
    showButton: PropTypes.bool,
    delimiters: PropTypes.arrayOf(PropTypes.number),
    delimiterChars: PropTypes.arrayOf(PropTypes.string),
    handleDelete: PropTypes.func,
    handleAddition: PropTypes.func,
    handleInputChange: PropTypes.func,
    handleFocus: PropTypes.func,
    handleBlur: PropTypes.func,
    handleValidate: PropTypes.func,
    minQueryLength: PropTypes.number,
    maxSuggestionsLength: PropTypes.number,
    classNames: PropTypes.object,
    allowNew: PropTypes.bool,
    allowBackspace: PropTypes.bool,
    tagComponent: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element
    ]),
    inputAttributes: PropTypes.object,
    buttonAttributes: PropTypes.object,
    addOnBlur: PropTypes.bool,
    clearInputOnDelete: PropTypes.bool
}

module.exports = Tagger;

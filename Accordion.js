import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight } from 'react-native';
import Collapsible from './Collapsible';
import { ViewPropTypes } from './config';

const COLLAPSIBLE_PROPS = Object.keys(Collapsible.propTypes);
const VIEW_PROPS = Object.keys(ViewPropTypes);

export default class Accordion extends Component {
  static propTypes = {
    sections: PropTypes.array.isRequired,
    renderHeader: PropTypes.func.isRequired,
    renderContent: PropTypes.func.isRequired,
    renderFooter: PropTypes.func,
    renderSectionTitle: PropTypes.func,
    activeSections: PropTypes.arrayOf(PropTypes.number).isRequired,
    onChange: PropTypes.func.isRequired,
    align: PropTypes.oneOf(['top', 'center', 'bottom']),
    duration: PropTypes.number,
    easing: PropTypes.string,
    underlayColor: PropTypes.string,
    touchableComponent: PropTypes.func,
    touchableProps: PropTypes.object,
    disabled: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.number),
    ]),
    expandFromBottom: PropTypes.bool,
    expandMultiple: PropTypes.bool,
    onAnimationEnd: PropTypes.func,
    sectionContainerStyle: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    underlayColor: 'black',
    disabled: false,
    expandFromBottom: false,
    expandMultiple: false,
    touchableComponent: TouchableHighlight,
    renderSectionTitle: () => null,
    onAnimationEnd: () => null,
    sectionContainerStyle: {},
  };

  _toggleSection(section) {
    const { activeSections, expandMultiple, onChange } = this.props;

    let updatedSections = [];

    if (activeSections.includes(section)) {
      updatedSections = activeSections.filter(a => a !== section);
    } else if (expandMultiple) {
      updatedSections = [...activeSections, section];
    } else {
      updatedSections = [section];
    }

    onChange && onChange(updatedSections);
  }

  render() {
    let viewProps = {};
    let collapsibleProps = {};

    Object.keys(this.props).forEach(key => {
      if (COLLAPSIBLE_PROPS.includes(key)) {
        collapsibleProps[key] = this.props[key];
      } else if (VIEW_PROPS.includes(key)) {
        viewProps[key] = this.props[key];
      }
    });

    const {
      activeSections,
      containerStyle,
      sectionContainerStyle,
      expandFromBottom,
      sections,
      underlayColor,
      touchableProps,
      touchableComponent: Touchable,
      onAnimationEnd,
      renderContent,
      renderHeader,
      renderFooter,
      renderSectionTitle,
      disabled,
    } = this.props;

    const renderCollapsible = (section, key, isDisabled) => (
      <Collapsible
        collapsed={!activeSections.includes(key)}
        {...collapsibleProps}
        onAnimationEnd={() => onAnimationEnd(section, key)}
      >
        {renderContent(
          section,
          key,
          activeSections.includes(key),
          sections,
          isDisabled
        )}
      </Collapsible>
    );

    const checkIfItemIsDisabled = key => {
      return (
        (typeof disabled === 'boolean' && disabled) ||
        (Array.isArray(disabled) && disabled.includes(key))
      );
    };

    return (
      <View style={containerStyle} {...viewProps}>
        {sections.map((section, key) => {
          const isDisabled = checkIfItemIsDisabled(key);
          return (
            <View key={key} style={sectionContainerStyle}>
              {renderSectionTitle(
                section,
                key,
                activeSections.includes(key),
                isDisabled
              )}

              {expandFromBottom && renderCollapsible(section, key, isDisabled)}

              <Touchable
                disabled={isDisabled}
                onPress={() => (isDisabled ? {} : this._toggleSection(key))}
                underlayColor={isDisabled ? 'transparent' : underlayColor}
                {...touchableProps}
              >
                {renderHeader(
                  section,
                  key,
                  activeSections.includes(key),
                  sections,
                  isDisabled
                )}
              </Touchable>

              {!expandFromBottom && renderCollapsible(section, key, isDisabled)}

              {renderFooter &&
                renderFooter(
                  section,
                  key,
                  activeSections.includes(key),
                  sections,
                  isDisabled
                )}
            </View>
          );
        })}
      </View>
    );
  }
}

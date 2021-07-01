import React from 'react'
import { render, cleanup } from '@testing-library/react'

import TransText from '../src/TransText'

describe('TransText', () => {
  afterEach(cleanup)

  describe('without components', () => {
    test('should return the provided text', () => {
      const text = 'The number is 42'

      const { container } = render(
        <TransText text={text} />
      )
      expect(container.textContent).toContain(text)
    })
  })

  describe('with components', () => {
    test('should work with HTML5 Elements', () => {
      const expectedText = 'The number is 42'
      const text = '<0>The number is <1>42</1></0>'
      const expectedHTML = '<h1 id="u1">The number is <b id="u2">42</b></h1>'

      const { container } = render(
        <TransText
          text={text}
          components={[<h1 id="u1" />, <b id="u2" />]}
        />
      )
      expect(container.textContent).toContain(expectedText)
      expect(container.innerHTML).toContain(expectedHTML)
    })

    test('should work with React Components', () => {
      const text = '<0>The number is <1>42</1></0>'
      const expectedText = 'The number is 42'
      const expectedHTML = '<h1>The number is <b>42</b></h1>'
      const H1 = (p) => <h1 {...p} />
      const B = (p) => <b {...p} />

      const { container } = render(
        <TransText
          text={text}
          components={[<H1 />, <B />]}
        />
      )
      expect(container.textContent).toContain(expectedText)
      expect(container.innerHTML).toContain(expectedHTML)
    })

    test('should work with very nested components', () => {
      const text = '<0><1>Is</1> <2>the <3>number</3></2> 42?</0>'
      const expectedText = 'Is the number 42?'
      const expectedHTML = '<div><p>Is</p> <b>the <i>number</i></b> 42?</div>'

      const { container } = render(
        <TransText
          text={text}
          components={[<div />, <p />, <b />, <i />]}
        />
      )
      expect(container.textContent).toContain(expectedText)
      expect(container.innerHTML).toContain(expectedHTML)
    })

    test('should work without replacing the HTMLElement if the index is incorrectly', () => {
      const text = 'test <10>with bad index</10>.'
      const expectedHTML = 'test with bad index.'

      const { container } = render(
        <TransText
          text={text}
          components={[<b />]}
        />
      )
      expect(container.innerHTML).toContain(expectedHTML)
    })
  })

  describe('components prop as a object', () => {
    test('should work with component as a object', () => {
      const text = 'test <example>components as a object</example>.'
      const expectedHTML = 'test <b>components as a object</b>.'

      const { container } = render(
        <TransText
          text={text}
          components={{ example: <b /> }}
        />
      )
      expect(container.innerHTML).toContain(expectedHTML)
    })

    test('should work with component as a object of React Components', () => {
      const text = 'test <example>components as a object</example>.'
      const expectedHTML = 'test <b class="test">components as a object</b>.'

      const Component = ({ children }) => <b className="test">{children}</b>

      const { container } = render(
        <TransText
          text={text}
          components={{ example: <Component /> }}
        />
      )
      expect(container.innerHTML).toContain(expectedHTML)
    })

    test('should work with component as a object without replacing the HTMLElement if the key is incorrect', () => {
      const text = 'test <example>components <thisIsIncorrect>as <u>a</u> object</thisIsIncorrect></example>.'
      const expectedHTML =
        'test <b class="test">components as <u>a</u> object</b>.'

      const Component = ({ children }) => <b className="test">{children}</b>

      const { container } = render(
        <TransText
          text={text}
          components={{ example: <Component />, u: <u /> }}
        />
      )
      expect(container.innerHTML).toContain(expectedHTML)
    })
  })
})

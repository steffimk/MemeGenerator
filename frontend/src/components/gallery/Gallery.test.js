import { render, screen } from '@testing-library/react';
import Gallery from './Gallery';
import {distributeImagesToColumns} from './Gallery';
import React from "react";
import {MemoryRouter} from 'react-router-dom';

test('Create new Meme button exists', () => {
  render((
        <MemoryRouter>
        <Gallery />
      </MemoryRouter>
  ));
  const linkElement = screen.getByText(/Create new Meme/i);
  expect(linkElement).toBeInTheDocument();
});

test('memes are correctly distributed across columns', () => {

  let list = [1,2,3,4,5,6,7,8,9]

  let slices = distributeImagesToColumns(list);
  console.log([].concat.apply([], slices));

  // No images have been lost
  expect([].concat.apply([], slices).length).toEqual(list.length);

  // Slices have expected length. Last column may be longer.
  for(const slice of slices.slice(0,slices.length-1)){
      expect(slice.length).toEqual(Math.floor(list.length/4));
  }

});
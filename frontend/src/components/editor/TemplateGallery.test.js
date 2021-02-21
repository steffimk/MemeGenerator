import {fireEvent, render, screen} from '@testing-library/react';
import React from "react";
import TemplateGallery from "./TemplateGallery";

test('New Template button exists and opens NewTemplateDialog', async () => {
    render(
        <TemplateGallery
            apiEndpoint={""}
            changeCurrentImage={() => {}}
            currentImage={{}}
            images={[]}
            isInAddImageMode={false}
        />
    );

    const newTemplateButton = screen.getByText(/New Template Image/i);
    expect(newTemplateButton).toBeInTheDocument();
    fireEvent.click(newTemplateButton);

    const newTemplateDialog = await screen.getByText(/Add new Template Background/i);
    expect(newTemplateDialog).toBeInTheDocument();

});


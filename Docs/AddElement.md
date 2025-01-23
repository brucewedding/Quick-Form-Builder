# Adding a New Form Element

This guide explains how to add a new form element type to the Quick Form Builder system.

## Overview

Form elements are the building blocks of forms in our system. Each element type (like text fields, checkboxes, etc.) is implemented as a separate component that follows a consistent pattern and interface.

## Step-by-Step Guide

### 1. Add Element Type Definition

In `src/components/FormElements.tsx`, add your new element type to the `ElementsType` union type:

```typescript
export type ElementsType =
  | "TextField"
  | "TitleField"
  // ... other existing types ...
  | "YourNewFieldType"; // Add your new type here
```

### 2. Create Element Component File

Create a new file for your element under `src/components/field/` (e.g., `YourNewField.tsx`). The file should include:

#### a) Type Definitions
```typescript
type CustomInstance = FormElementInstance & {
  extraAttributes: {
    label: string;
    helperText: string;
    required: boolean;
    placeholder: string;
    // Add any additional attributes your element needs
  };
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
  // Add validation for any additional properties
});
```

#### b) Element Implementation
```typescript
export const YourNewFormElement: FormElement = {
  type: "YourNewFieldType",
  
  // Factory function to create new instances
  construct: (id: string) => ({
    id,
    type: "YourNewFieldType",
    extraAttributes: {
      label: "Default Label",
      helperText: "Default helper text",
      required: false,
      placeholder: "Default placeholder",
    },
  }),

  // Sidebar button configuration
  designerBtnElement: {
    icon: YourIcon,  // Import from react-icons
    label: "Your Element",
  },

  // Component references
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  // Validation logic
  validate: (formElement: FormElementInstance, currentValue: string): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue.length > 0;
    }
    return true;
  },
};
```

#### c) Required Components

1. Designer Component (Preview in builder):
```typescript
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { label, helperText, required, placeholder } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Input readOnly disabled placeholder={placeholder} />
      {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>
  );
}
```

2. Form Component (Live form element):
```typescript
function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: (key: string, value: string) => void;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;
  // Implementation for the actual form input
}
```

3. Properties Component (Settings panel):
```typescript
function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  // Implementation for property editing
}
```

### 3. Register the Element

In `src/components/FormElements.tsx`, import and add your element to the FormElements object:

```typescript
import { YourNewFormElement } from "./field/YourNewField";

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
  // ... other elements ...
  YourNewFieldType: YourNewFormElement,
};
```

### 4. Add to Sidebar

In `src/components/FormElementsSidebar.tsx`, add your element to the sidebar:

```typescript
<SidebarBtnElement formElement={FormElements.YourNewFieldType} />
```

## Database Integration

No additional database changes are required. The system stores form content as JSON in the Prisma database, and new elements are automatically handled as long as they follow the FormElementInstance interface.

## Testing Your New Element

1. Create a new form
2. Verify your element appears in the sidebar
3. Test dragging and dropping the element
4. Test property editing
5. Test form saving and loading
6. Test form publishing and submission

## Best Practices

1. Follow the existing naming conventions
2. Implement proper validation
3. Include helpful default values
4. Add appropriate TypeScript types
5. Ensure proper error handling
6. Test all component states (preview, edit, submit)

## Common Issues

- If the element doesn't appear in the sidebar, check the FormElements export
- If properties don't update, verify the PropertiesComponent implementation
- If validation fails, check the validate function implementation

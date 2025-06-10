# Prompt

## React

#### [Single Responsibility Principle in React](https://cekrem.github.io/posts/single-responsibility-principle-in-react/)

Key Takeaways

1. Separate data and presentation - use hooks for data, components for UI
2. Create focused components - each component should do one thing well
3. Use composition to build complex features from simple parts
4. Extract reusable logic into custom hooks
5. Think in layers - data, business logic, presentation

## v0

When generating React component:

- Always use TypeScript.
- Avoid using any type.
- Always use Shadcn and Tailwind.
- Don't type React.FC on the component.
- use const instead of function for the component.
- The component must adhere to composable pattern of React.
- Don't overuse useState and useEffect hooks. Use computed state if possible.
- Use useMemo and useCallback when necessary to prevent unnecessary rendering.
- Use server action and useActionState if possible. Otherwise, use fetch and API route handler. When the component needs to do data mutation, make it so that it accepts server action as props.
- Create server component if possible. Otherwise, create client component.
- Use Suspense and streaming when possible.
- Always validate inputs using zod in the server action and API end point.
- When possible create a custom hook to group useState and useEffect that encapsulates certain logic.
- Create a higher order component when needed to add certain functionalities that are not completely coupled to the component.
- When makes sense, combine related components, hooks, functions in the same file so that it's easy to distribute and use.
- Text content must be HTML-escaped.

### [代码坏味道重构AI提示](https://aigo.netlify.app/docs/codesemell/%E4%BB%A3%E7%A0%81%E5%9D%8F%E5%91%B3%E9%81%93/#%E4%BB%A3%E7%A0%81%E5%9D%8F%E5%91%B3%E9%81%93%E9%87%8D%E6%9E%84ai%E6%8F%90%E7%A4%BA)

```text
Context:
You are working on a codebase that has been growing over time. During a recent review, you identified several common code smells, including:
	- Long Methods
	- Long Parameter List
	- Duplicated Code
	- Dead Code
Your goal is to refactor the code to improve readability, maintainability, and overall quality.

Constraint:
    - Create a new file whenever a new class needs to be created
    - Fix text should not change the case and implementation code
    - When writing tests, duplicate code can be allowed
    - Avoid using duplicate names when naming

Based on the above contexts. You will use the ReAct framework to guide this process to analyze, observe, execute, and finally complete the code refactoring.

Thought-1:
I need to identify specific code smells in the current implementation to determine what refactoring techniques to apply.

Observation-1:
I’ve found a Long Method that spans over n lines and performs multiple tasks. Additionally, there are instances of Duplicated Code where similar logic appears in three different places. Lastly, there are some Long Parameter List exists.

Action-1:
1. For the Long Method:
   I will apply the *Extract Method* technique to break this method into smaller, more focused methods.
2. For the Duplicated Code:
   I will use the *Extract Method* technique to consolidate the duplicated logic into a single reusable method.
3. For the Long Parameter:
   I will Introduce Parameter Object to simplify parameter passing.

Thought-2:
Now that I’ve addressed the Long Method, Duplicated Code, I should check for any remaining code smells like Dead Code

Observation-2:
I discovered several methods that are no longer called anywhere in the code (Dead Code).

Action-2:
For the Dead Code:
I will safely remove these unused methods after confirming they are not referenced anywhere else in the codebase.

Thought-3:
Now that I’ve addressed Duplicated Code, I should check if the related tests are broken

Observation-3:
I discovered several tests that are broken

Action-3:
I'll fix these tests without changing the scene
```

## Cursor

[cursor](https://cursor.directory/)

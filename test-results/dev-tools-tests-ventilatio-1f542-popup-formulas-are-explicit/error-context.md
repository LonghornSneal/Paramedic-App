# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e4]:
      - button "Open Patient Info Sidebar" [ref=e6] [cursor=pointer]:
        - img [ref=e7] [cursor=pointer]
      - generic [ref=e9]:
        - heading "Paramedic Quick Reference" [level=1] [ref=e10]
        - searchbox "Search Treatment Information" [ref=e12]
      - generic [ref=e14]:
        - generic [ref=e15]:
          - button "Navigate Back" [disabled] [ref=e16]:
            - img [ref=e17]
          - button "Navigate Forward" [disabled] [ref=e19]:
            - img [ref=e20]
        - button "Home" [ref=e22] [cursor=pointer]:
          - img [ref=e23] [cursor=pointer]
        - button "History" [ref=e25] [cursor=pointer]:
          - img [ref=e26] [cursor=pointer]
  - main [ref=e28]:
    - paragraph [ref=e30]: Loading categories...
  - contentinfo [ref=e31]:
    - text: App Version 0.7
    - button "Settings" [ref=e32] [cursor=pointer]
```
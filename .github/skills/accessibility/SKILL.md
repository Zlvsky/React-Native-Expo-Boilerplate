Here is the comprehensive, detailed accessibility checklist for app, specifically tailored for screen reader compatibility and blind/low-vision players.
1. Menu Navigation & UI Architecture
Since app is a UI-centric RPG, the interface must behave like a perfectly structured application.
 * [] Logical Focus Order: The screen reader focus must move linearly (top-to-bottom, left-to-right) or follow a logical grouping without skipping interactive elements.
 * [] Semantic Grouping: Item names, rarities, and stats must be read as a single unit (e.g., "Iron Sword, Rarity: Common, Attack +5") instead of requiring three separate swipes/clicks.
 * [] Descriptive Labels (Alt-Text): Every icon (sword, potion, gear) must have a text label. A button must not be announced as "Button 42," but as "Open Equipment."
 * [] State Announcements: The screen reader must announce whether an element is "Selected," "Expanded," or "Disabled" (e.g., for tabs like "Character," "Inventory," "Guild").
 * [] No Focus Traps: Users must be able to exit any pop-up or sub-menu using a standard "Back" gesture or a clearly labeled "Close" button.
 * [ ] Heading Levels: Use virtual headings for different sections (e.g., "Shop Section," "Quest Log") to allow users to jump quickly between areas.
2. Combat & Gameplay Feedback
In a dungeon crawler, critical information must be relayed instantly through audio.
 * [] Screen Reader Interrupts: Critical events (e.g., "Level Up!" or "Low Health Warning") must use "Polite" or "Assertive" interruptions to notify the player immediately.
 * [] Combat Log Accessibility: The battle log (who hit whom and for how much) must be focusable or auto-read. Include a setting to read "Last Action Only" to avoid audio clutter.
 * [ ] Distinct Audio Cues (Earcons): * Unique sounds for critical hits vs. normal hits.
   * A distinct "danger" drone or heartbeat when HP < 20\%.
   * A specific "shimmer" sound when legendary or rare loot drops.
3. Inventory & Item Management
Inventory management is often the biggest barrier for blind players in RPGs.
 * [] Detailed Item Tooltips: Upon focusing an item, the screen reader should announce: Name, Type, Level Requirement, Gold Value, and Stat Changes.
 * [ ] Sorting Feedback: When the player sorts their inventory, the screen reader must confirm the action (e.g., "Sorted by Rarity" or "Sorted by Type").
 * [] Comparison Mode: A function that compares the selected item with the currently equipped one (e.g., "New Sword: +2 Damage compared to current weapon").
 * [ ] Bulk Actions: Ensure "Sell All Trash" or "Multi-select" buttons are clearly labeled and provide a summary of the action (e.g., "Sold 12 items for 500 Gold").
4. Multiplayer & Social Features
Ensuring that community interactions in app are inclusive.
 * [ ] Chat Text-to-Speech (TTS): An optional setting to automatically read incoming chat messages, with filters for "Guild," "Global," or "Whisper."
 * [ ] Sender Identification: Messages should be read as "[Player Name] says: [Message]."
 * [ ] Native Input Compatibility: The text entry field must be fully compatible with system keyboards, including dictation and Braille displays.
 * [ ] Player Inspection: The ability to "read" another player's loadout and stats via the screen reader when selecting them in a lobby or guild list.
5. Technical Accessibility Settings
A dedicated "Accessibility" menu to fine-tune the experience.
 * [ ] Independent Volume Sliders: Separate controls for Background Music, Sound Effects (SFX), and Screen Reader/TTS volume.
 * [ ] Adjustable Speech Rate: If the game uses an internal TTS engine, users must be able to control the speed and pitch.
 * [] Haptic Feedback: Vibrations to confirm button presses, successful dodges, or when it is the player's turn in combat.
 * [] High Contrast Support: While focusing on screen readers, ensure the UI also supports a high-contrast mode (minimum ratio 4.5:1) for low-vision users.
 * [] Screen Reader Detection: An option for the game to automatically enable accessibility features if it detects a system screen reader (TalkBack/VoiceOver/NVDA) is active.
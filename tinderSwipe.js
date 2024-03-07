const DECISION_THRESHOLD = 75

  let isAnimating = false
  let pullDeltaX = 0 // distance from the card being dragged

  function startDrag(event) {
    if (isAnimating) return

    // get the first article element
    const ACTUAL_CARD = event.target.closest('article')
    if (!ACTUAL_CARD) return

    // get initial position of mouse or finger
    const START_X = event.pageX ?? event.touches[0].pageX

    // listen the mouse and touch movements
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)

    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })

    function onMove(event) {
      // current position of mouse or finger
      const CURRENT_X = event.pageX ?? event.touches[0].pageX

      // the distance between the initial and current position
      pullDeltaX = CURRENT_X - START_X

      // there is no distance traveled in X axis
      if (pullDeltaX === 0) return

      // change the flag to indicate we are animating
      isAnimating = true

      // calculate the rotation of the card using the distance
      const DEG = pullDeltaX / 14

      // apply the transformation to the card
      ACTUAL_CARD.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`

      // change the cursor to grabbing
      ACTUAL_CARD.style.cursor = 'grabbing'

      // change opacity of the choice info
      const OPACITY = Math.abs(pullDeltaX) / 100
      const IS_RIGHT = pullDeltaX > 0

      const CHOICE_EL = IS_RIGHT
        ? ACTUAL_CARD.querySelectorAll('.choice .like')
        : ACTUAL_CARD.querySelectorAll('.choice .nope')

      CHOICE_EL.style.opacity = OPACITY
    }

    function onEnd(event) {
      // remove the event listeners
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)

      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)

      // Know if the useer makes the decision
      const DECISION_MADE = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

      if (DECISION_MADE) {
        const GO_RIGHT = pullDeltaX >= 0

        // Add class according to the decision
        ACTUAL_CARD.classList.add(GO_RIGHT ? 'go-right' : 'go-left')
        ACTUAL_CARD.addEventListener('transitionend', () => {
          ACTUAL_CARD.remove()
        })
      } else {
        ACTUAL_CARD.classList.add('reset')
        ACTUAL_CARD.classList.remove('go-right', 'go-left')

        ACTUAL_CARD.querySelectorAll('.choice').forEach(choice => {
          choice.style.opacity = 0
        })
      }

      // Reset the variables
      ACTUAL_CARD.addEventListener('transitionend', () => {
        ACTUAL_CARD.removeAttribute('style')
        ACTUAL_CARD.classList.remove('reset')

        pullDeltaX = 0
        isAnimating = false
      })

      // Reset the choice info opacity
      ACTUAL_CARD
        .querySelectorAll(".choice")
        .forEach((el) => (el.style.OPACITY = 0));
    }
  }

  document.addEventListener('mousedown', startDrag)
  document.addEventListener('touchstart', startDrag, { passive: true })
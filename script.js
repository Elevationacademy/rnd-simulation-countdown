( () => {
    setInterval( () => {
        const d = new Date()
        document.querySelector( '#clock .time' ).innerHTML = d.toLocaleTimeString()
    }, 1000 )
} )()

class RnDUsersCountdown {
    static SECOND = 1000
    static MINUTE = RnDUsersCountdown.SECOND * 60
    static HOUR = RnDUsersCountdown.MINUTE * 60
    static DAY = RnDUsersCountdown.HOUR * 24

    static THRESHOLD_NORMALIZED_RANGE = 7

    ms = 0
    hours = 0
    initialUsers = 0
    maxTimeMs = 0

    currentTimeState = {
        hours: 0,
        minutes: 0,
        seconds: 0
    }

    constructor( hours, initialUsers ) {
        this.hours = hours
        this.maxTimeMs = hours * RnDUsersCountdown.MINUTE * RnDUsersCountdown.SECOND / 10
        this.countDown = ( new Date() ).setHours( new Date().getHours() + hours )
        this.initialUsers = initialUsers
        this.setAnimationTimeDuration()
    }

    setAnimationTimeDuration() {
        const duration = this.hours * 60 * 60 + 's'
        const spans = document.querySelectorAll( '#countdown .hand span' )
        $( spans[ 0 ] ).css( 'animation-duration', duration )
        $( spans[ 1 ] ).css( 'animation-duration', duration )
    }

    usersRemained( timePassedInMs ) {
        const MIN_TIME = 1000
        const NORMALIZED_TIME = RnDUsersCountdown.THRESHOLD_NORMALIZED_RANGE * ( ( timePassedInMs - MIN_TIME ) / ( this.maxTimeMs - MIN_TIME ) )

        return this.initialUsers * Math.exp( -1 * ( NORMALIZED_TIME / 5 ) )
    }

    render() {
        document.getElementById( 'time-left' ).innerText = `${ this.currentTimeState.hours }:${ this.currentTimeState.minutes }:${ this.currentTimeState.seconds }`

        if ( this.ms % 3 === 0 ) {
            document.querySelector( '#users-remained .count' ).innerText = parseInt( this.usersRemained( this.ms ) ).toLocaleString()
        }
    }

    start() {
        setInterval( () => {
            const now = new Date().getTime()
            const distance = this.countDown - now

            this.currentTimeState = {
                hours: Math.floor( distance % RnDUsersCountdown.DAY / RnDUsersCountdown.HOUR ),
                minutes: Math.floor( distance % RnDUsersCountdown.HOUR / RnDUsersCountdown.MINUTE ),
                seconds: Math.floor( distance % RnDUsersCountdown.MINUTE / RnDUsersCountdown.SECOND )
            }

            this.render()

            if ( distance < 0 ) {
                clearInterval( x )
            }

            this.ms += RnDUsersCountdown.SECOND
        }, RnDUsersCountdown.SECOND )
    }
}

const counter = new RnDUsersCountdown( 3, 998999 )

counter.start()
